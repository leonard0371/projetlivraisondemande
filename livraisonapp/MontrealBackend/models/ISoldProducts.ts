import mongoose, { model, Schema } from "mongoose";

interface ISoldProducts extends Document {
    userId: mongoose.Types.ObjectId;
    subTotal: number,
    products: [
      {
        productId: mongoose.Types.ObjectId;
        cartId:mongoose.Types.ObjectId;
        vendorId : mongoose.Types.ObjectId;
        name:string;
        quantity: number;
        price: number;
      }
    ]
    CreatedAt : Date;
  }
  const SoldProductSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" ,required: true},
    subTotal: { type: Number ,required:true},
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Products",
        },
        name : {type:String},
        quantity: { type: Number, required: true },
        price:{type: Number},
        vendorId : {type: Schema.Types.ObjectId, ref: "Vendor"},
      },
    ],
    CreatedAt: { type: Date, default: Date.now } 
  });
const SoldModel = model<ISoldProducts>("SoldProducts", SoldProductSchema);
export { ISoldProducts, SoldModel };
