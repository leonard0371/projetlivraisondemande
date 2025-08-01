import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { IUser } from "../models/Iuser";
import { Model } from "mongoose";
import { Ivendor } from "../models/Ivendor";
import { Iadmin,AdminModel } from "../models/Iadmin";

@injectable()
export class AdminRepository extends BaseRepository<Iadmin> {
    constructor(@inject("AdminModel") private AdminModel: Model<Iadmin>) { 
        super(AdminModel);
    }
}