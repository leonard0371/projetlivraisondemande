import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUser } from "../models/Iuser";
import { UnitOfWork } from "../Repo/UnitOfWork";
import { debug } from "console";
import { VendorRepository } from "../ServiceRepository/VendorRepository";
import { VendorpaymentsRepository } from "../ServiceRepository/vendorpaymentsRepository";
import { Ivendor, vendorModel } from "../models/Ivendor";
import { IVendorPayment } from "../models/vendorPayment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../ServiceRepository/UserRepository";
import { sendEmail } from "../ServiceRepository/EmailService";
import validate from "deep-email-validator";

// var salt= bcrypt.genSaltSync(10)
// var hash = bcrypt.hashSync('B4c0/\/',salt)
  @injectable()
  export class PaymentController {
    constructor(
      @inject(VendorRepository) private vendorRepository: VendorRepository,
      @inject(VendorpaymentsRepository) private vendorpaymentsRepository: VendorpaymentsRepository,
      @inject(UserRepository) private userRepository: UserRepository,
      @inject(UnitOfWork) private unitOfWork: UnitOfWork
    ) {}

  async getAllVendorUnpaid(req: Request, res: Response): Promise<void> {
    await this.unitOfWork.start();
    try {
      debugger;
      const repoWithSession = this.unitOfWork.getRepository<IVendorPayment>(
        this.vendorpaymentsRepository
      );

      // Récupérer tous les paiements
      const vendorPayments = await repoWithSession.getAll();

      // Pour chaque paiement, récupérer les informations du Vendor associé
      const vendorPaymentsWithVendor = await Promise.all(
        vendorPayments.map(async (payment) => {
          const vendor = await vendorModel.findById(payment.vendorId).lean(); // .lean() pour retourner un objet pur
          return {
            ...payment.toObject(), // convertir payment (document mongoose) en objet JS pur
            vendor: vendor ? {
              email: vendor.email,
            } : null
          };
        })
      );

      await this.unitOfWork.complete();
      res.status(200).json(vendorPaymentsWithVendor);

    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }

}


