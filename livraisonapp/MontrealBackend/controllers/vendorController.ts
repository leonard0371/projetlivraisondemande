import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUser } from "../models/Iuser";
import { UnitOfWork } from "../Repo/UnitOfWork";
import { debug } from "console";
import { VendorRepository } from "../ServiceRepository/VendorRepository";
import { Ivendor } from "../models/Ivendor";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../ServiceRepository/UserRepository";
import { sendEmail } from "../ServiceRepository/EmailService";
import validate from "deep-email-validator";

// var salt= bcrypt.genSaltSync(10)
// var hash = bcrypt.hashSync('B4c0/\/',salt)
@injectable()
export class VendorController {
  constructor(
    @inject(VendorRepository) private vendorRepository: VendorRepository,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(UnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  async loginVendor(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const jwtSecret = "h4WDT6xZ9xQlXwe2eHvCXNnWn/KNFw+YREdd+6aQl1U=";
    if (!jwtSecret) {
      res.status(500).json({
        error: "JWT_SECRET is not defined in the environment variables",
      });
      return;
    }
    try {
      await this.unitOfWork.start();

      const repoWithSession = this.unitOfWork.getRepository<Ivendor>(
        this.vendorRepository
      );
      const vendors = await repoWithSession.find({ email });

      // console.log("Input password:", email);
      if (vendors.length === 0) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const vendor = vendors[0];

      // console.log("Vendor password:",password, vendor.password);

      const isPasswordValid = bcrypt.compareSync(password, vendor?.password);
      // console.log(isPasswordValid, "vendorsvendorsvendorsvendors");
      if (!isPasswordValid) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const token = jwt.sign(
        { id: vendor.id, email: vendor.email },
        jwtSecret,
        { expiresIn: "1h" }
      );

      await this.unitOfWork.complete();
      res
        .status(200)
        .json({ token, vendor: { id: vendor.id, email: vendor.email } });
    } catch (error: any) {
      await this.unitOfWork.abort();
      // console.error("Login error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateVendor(req: Request, res: Response): Promise<void> {
    const product: Ivendor = req.body;
    console.log(req.body, "IsActiveIsActiveIsActive");
    const id = req.body._id;
    await this.unitOfWork.start();
    try {
      const repoWithSession = this.unitOfWork.getRepository<Ivendor>(
        this.vendorRepository
      );
      const newProduct = await repoWithSession.update(id, product);
      await this.unitOfWork.complete();
      if (req.body.IsActive === true) {
        await sendEmail(
          req.body.email,
          "Montreal Haven Account Approved",
          "Montreal Haven",
          "Thank you for registering. Your account is approved now. You may login to your vendor account. "
        );
      }
      res.status(200).json(newProduct);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
  async changeVendorStatus(req: Request, res: Response): Promise<void> {
    const product: Ivendor = req.body;
    console.log(req.body.IsActive, "IsActiveIsActiveIsActive");
    const id = req.body._id;
    await this.unitOfWork.start();
    try {
      const repoWithSession = this.unitOfWork.getRepository<Ivendor>(
        this.vendorRepository
      );
      const newProduct = await repoWithSession.update(id, product);
      await this.unitOfWork.complete();
      if (req.body.IsActive === true) {
        await sendEmail(
          req.body.email,
          "Montreal Haven Account Approved",
          "Montreal Haven",
          "Thank you for registering. Your account is approved now. You may login to your vendor account."
        );
      }
      res.status(200).json(newProduct);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
  async createVendor(req: Request, res: Response): Promise<void> {
    const vendor: Ivendor = req.body;
    let responseemail = await validate(vendor.email);
    // console.log(responseemail,vendor.email, "vendorvendorvendorvendor");
    await this.unitOfWork.start();
    try {
      const repoWithSession = this.unitOfWork.getRepository<Ivendor>(
        this.vendorRepository
      );
      const userRepoWithSession = this.unitOfWork.getRepository<IUser>(
        this.userRepository
      );
      const existingVendor = await repoWithSession.find({
        email: vendor.email,
      });
      const existingUser = await userRepoWithSession.find({
        email: vendor.email,
      });
      if (existingUser.length > 0 || existingVendor.length > 0) {
        res.status(400).json({ error: "Email already exists" });
        return;
      } 
      // else if (responseemail.valid === false) {
      //   res.status(400).json({ error: "Invalid Email Address" });
      //   return;
      // } 
      else {
        const newVendor = await repoWithSession.create(vendor);
        await this.unitOfWork.complete();
        res.status(200).json(newVendor);
      }

      await sendEmail(vendor.email, 'Montreal Haven Account Registration','Montreal Haven',
         'Thank you for registering with Montreal Haven. Your account will be activated upon approval. ');
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
  async deleteVendor(req: Request, res: Response): Promise<void> {
    const { id } = req.query;
    // console.log(id, typeof id, "sdaskfkaljfa");
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id parameter" });
      return;
    }
    await this.unitOfWork.start();
    try {
      const repoWithSession = this.unitOfWork.getRepository<Ivendor>(
        this.vendorRepository
      );
      await repoWithSession.delete(id);
      await this.unitOfWork.complete();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }

  async getAllVendor(req: Request, res: Response): Promise<void> {
    await this.unitOfWork.start();
    try {
      debugger;
      const repoWithSession = this.unitOfWork.getRepository<Ivendor>(
        this.vendorRepository
      );
      const users = await repoWithSession.getAll();
      await this.unitOfWork.complete();
      res.status(200).json(users);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
}
