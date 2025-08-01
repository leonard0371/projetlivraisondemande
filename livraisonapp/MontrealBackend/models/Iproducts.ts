import mongoose, { Schema, model, Document } from "mongoose";
import { IIdentity } from "../Repo/IIdentity";

interface Iproduct extends Document {
  _id:mongoose.Types.ObjectId;
  name: string;
  // price: number;
  price: mongoose.Types.Decimal128;
  description: string;
  features: string;
  images: string[];
  category: string;
  subcategory : string;
  vendorId: string;
  quantity:number;
  cartQuantity:number;
}

const ProductSchema = new Schema<Iproduct>({
  name: { type: String, required: true },
  // price: { type: Number, required: true },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    set: (v: number) => mongoose.Types.Decimal128.fromString(v.toFixed(2)) 
  },
  category: { type: String, required: true },
  subcategory : {type:String},
  description: { type: String },
  features: { type: String },
  images: [{ type: String, required: true }],
  vendorId: { type: String ,required: true, ref:"Vendor"},
  quantity:{type:Number},
  cartQuantity:{type:Number}
});

const ProductModel = model<Iproduct>("Products", ProductSchema);

export { Iproduct, ProductModel };
