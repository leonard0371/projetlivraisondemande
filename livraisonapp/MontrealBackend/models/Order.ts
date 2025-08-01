import { Schema, model, Document, Types } from "mongoose";

// Interface qui définit la structure de la commande
interface IOrderItem {
  name: string;
  price: number | Types.Decimal128;  //Accepte `number` et `Decimal128`
  quantity: number;
  subTotal: number | Types.Decimal128;
  // vendorId: string; 
  vendorId: Types.ObjectId;
}

interface IOrder extends Document {
  customer_email: string;
  items: IOrderItem[];
  total_amount: number | Types.Decimal128;
  currency: string;
  createdAt: Date;
  customer_address?: {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string | null;
    postal_code?: string;
    state?: string;
  };
}

const OrderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  price: { type: Schema.Types.Decimal128, required: true },
  quantity: { type: Number, required: true },
  subTotal: { type: Schema.Types.Decimal128, required: true },
  // vendorId: { type: String, required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, 
});

const OrderSchema = new Schema<IOrder>({
  customer_email: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  total_amount: { type: Schema.Types.Decimal128, required: true }, 
  currency: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  customer_address: {
    city: { type: String },
    country: { type: String },
    line1: { type: String },
    line2: { type: String, default: null },
    postal_code: { type: String },
    state: { type: String },
  },
});

// Création du modèle à partir du schéma
const OrderModel = model<IOrder>("Order", OrderSchema);

export { IOrder, OrderModel };
