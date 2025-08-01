import mongoose, { Document, Schema } from "mongoose";

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  products: {
    productId: mongoose.Types.ObjectId;
    vendorId: mongoose.Types.ObjectId;
    cartId: mongoose.Types.ObjectId;
    quantity: number;
    subTotal: number;
    _id?: mongoose.Types.ObjectId;
    CreatedOn: Date;
  }[]; 
}
const CartSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" ,required: true},
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Products",
      },

      vendorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Vendor", // si tu as une collection Vendor
      },
      // cartId: {type: Schema.Types.ObjectId},
      quantity: { type: Number, required: true },
      subTotal: { type: Number, required: true },
    CreatedOn: { type: Date, default: Date.now } 
    },
  ],
});

export const CartModel = mongoose.model<ICart>("Cart", CartSchema);
