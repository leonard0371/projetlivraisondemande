import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import { Model } from "mongoose";
import { Iproduct } from "../models/Iproducts";
import { Icategories } from "../models/Icategories";

@injectable()
export class CategoryRepository extends BaseRepository<Icategories> {
    constructor(@inject("CategoryModel") private categoryModel: Model<Icategories>) {
        super(categoryModel);
    }
}