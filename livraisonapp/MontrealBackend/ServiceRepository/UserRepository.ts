import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { IUser } from "../models/Iuser";
import { Model } from "mongoose";

@injectable()
export class UserRepository extends BaseRepository<IUser> {
    constructor(@inject("UserModel") private userModel: Model<IUser>) { 
        super(userModel);
    }
}