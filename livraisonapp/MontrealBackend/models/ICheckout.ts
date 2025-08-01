import { Schema, model, Document } from "mongoose";
import { IIdentity } from "../Repo/IIdentity";

interface ICheckout extends Document {
  email: string;
  country: number;
  address: string;
  apartment: string;
  city: string;
  postalCode: number;
  phone: number;
  paymentMethod: string;
  billingAddress: string;
}

const CheckoutSchema = new Schema<ICheckout>({
  email: { type: String, required: true },
  country: { type: Number },
  address: { type: String },
  apartment: { type: String },
  city: [{ type: String }],
  postalCode: [{ type: Number }],
  phone: [{ type: Number }],
  paymentMethod: [{ type: String }],
  billingAddress: [{ type: String }],
});

const CheckoutModel = model<ICheckout>("Checkout", CheckoutSchema);

export { ICheckout, CheckoutModel };
