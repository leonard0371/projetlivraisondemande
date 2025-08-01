import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnitOfWork } from "../Repo/UnitOfWork";
import { UserRepository } from "../ServiceRepository/UserRepository";
import { VendorRepository } from "../ServiceRepository/VendorRepository";
import { IUser } from "../models/Iuser";
import { Ivendor } from "../models/Ivendor";

@injectable()
export class AuthController {
  constructor(
    @inject(UnitOfWork) private unitOfWork: UnitOfWork,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(VendorRepository) private vendorRepository: VendorRepository
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || "h4WDT6xZ9xQlXwe2eHvCXNnWn/KNFw+YREdd+6aQl1U=";
    if (!jwtSecret) {
      res.status(500).json({ error: "JWT_SECRET is not defined in the environment variables" });
      return;
    }

    try {
      await this.unitOfWork.start();

      const userRepoWithSession = this.unitOfWork.getRepository(this.userRepository);
      const vendorRepoWithSession = this.unitOfWork.getRepository(this.vendorRepository);

      const users = await userRepoWithSession.find({ email });
      const vendors = await vendorRepoWithSession.find({ email });

      let account: IUser | Ivendor | null = null;

      if (users.length > 0) {
        account = users[0] as IUser;
      } else if (vendors.length > 0) {
        account = vendors[0] as Ivendor;
        if (!account.IsActive) {
          res.status(400).json({ error: "Account Approval Pending" });
          return;
        }
      }

      if (!account) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      if (account !== null) {
        // console.log(password,account.password,'daskjdajkd')
        const isPasswordValid = bcrypt.compareSync(password, account.password);
        if (!isPasswordValid) {
          res.status(401).json({ error: "Invalid email or password" });
          return;
        }

        const role = account.role;

        const token = jwt.sign(
          {
            id: account.id,
            email: account.email,
            firstName:account.firstName,
            role: role,
          },
          jwtSecret,
          { expiresIn: "1h" }
        );

        await this.unitOfWork.complete();
        res.status(200).json({
          token,
          user: {
            id: account.id,
            email: account.email,
            firstName:account.firstName,
            role: role,
          },
        });
      }
    } catch (error: any) {
      await this.unitOfWork.abort();
      // console.error("Login error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}
