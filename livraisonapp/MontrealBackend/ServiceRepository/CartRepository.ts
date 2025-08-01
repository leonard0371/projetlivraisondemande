import { inject, injectable } from 'inversify';
import { BaseRepository } from '../Repo/baserepository';
import { Model } from 'mongoose';
import { ICart } from '../models/ICart';

// @injectable()
// export class CartRepository extends BaseRepository<ICart> {
//   constructor(@inject('CartModel') private cartModel: Model<ICart>) {
//     super(cartModel);
//   }

//   async findByUserId(userId: string): Promise<ICart[]> {
//     return this.cartModel.find({ userId }).exec();
//   }
// }


@injectable()
export class CartRepository extends BaseRepository<ICart> {
    constructor(@inject("CartModel") private cartModel: Model<ICart>) {
        super(cartModel);
    }

    async findByUserId(userId: string): Promise<ICart[]> {
        return this.cartModel.find({ userId }).exec();
    }

    async createCart(cartData: { userId: string; products: any[] }): Promise<ICart> {
        const newCart = new this.cartModel(cartData);
        return newCart.save();
    }
}

// import { inject, injectable } from "inversify";
// import { BaseRepository } from "../Repo/baserepository";
// import { Model } from "mongoose";
// import { Iproduct } from "../models/Iproducts";
// import { Icategories } from "../models/Icategories";
// import { ICart } from "../models/ICart";

// @injectable()
// export class CartRepository extends BaseRepository<ICart> {
//     constructor(@inject("CartModel") private cartModel: Model<ICart>) {
//         super(cartModel);
//     }
// }

