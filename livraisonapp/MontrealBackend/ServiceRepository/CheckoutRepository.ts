import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { Model } from "mongoose";
import { Iproduct } from "../models/Iproducts";
import { Icategories } from "../models/Icategories";
import { ICheckout } from "../models/ICheckout";

@injectable()
export class CheckoutRepository extends BaseRepository<ICheckout> {
    constructor(@inject("CheckoutModel") private checkoutModel: Model<ICheckout>) {
        super(checkoutModel);
    }
}