import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { IUser } from "../models/Iuser";
import { Model } from "mongoose";
import { Ivendor } from "../models/Ivendor";

@injectable()
export class VendorRepository extends BaseRepository<Ivendor> {
    constructor(@inject("vendorModel") private vendorModel: Model<Ivendor>) { 
        super(vendorModel);
    }
}