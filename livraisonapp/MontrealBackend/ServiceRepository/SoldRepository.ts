import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { Model } from "mongoose";
import { ISoldProducts, SoldModel } from "../models/ISoldProducts";

@injectable()
export class SoldRepository extends BaseRepository<ISoldProducts> {
    constructor(@inject("SoldProducts") private soldModel: Model<ISoldProducts>) { 
        super(soldModel);
    }
}