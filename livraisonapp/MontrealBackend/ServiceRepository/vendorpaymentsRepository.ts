import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { IUser } from "../models/Iuser";
import { Model } from "mongoose";
import { IVendorPayment } from "../models/vendorPayment";

@injectable()
export class VendorpaymentsRepository extends BaseRepository<IVendorPayment> {
    constructor(@inject("VendorPaymentModel") private VendorPaymentModel: Model<IVendorPayment>) { 
        super(VendorPaymentModel);
    }
}
