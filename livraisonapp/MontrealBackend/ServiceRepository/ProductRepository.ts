import { inject, injectable } from "inversify";
import { BaseRepository } from "../Repo/baserepository";
import mongoose, { Model } from "mongoose";
import { Iproduct } from "../models/Iproducts";

@injectable()
export class ProductRepository extends BaseRepository<Iproduct> {
    constructor(@inject("ProductModel") private productModel: Model<Iproduct>) {
        super(productModel);
    }
    async getProductsByCategory(categoryId: mongoose.Types.ObjectId): Promise<Iproduct[]> {
        return this.productModel.find({ category: categoryId }).exec();
    }
}