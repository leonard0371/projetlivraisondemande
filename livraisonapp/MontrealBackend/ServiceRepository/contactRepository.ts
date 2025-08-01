import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { Model } from "mongoose";
import { Icontact } from "../models/Icontact";

@injectable()
export class ContactRepository extends BaseRepository<Icontact> {
    constructor(@inject("ContactModel") private contactModel: Model<Icontact>) {
        super(contactModel);
    }
}