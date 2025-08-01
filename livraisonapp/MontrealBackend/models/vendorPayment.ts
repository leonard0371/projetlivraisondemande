import { Schema, model, Document, Types } from "mongoose";

interface IVendorPaymentItem {
  name: string;
  quantity: number;
  price: Types.Decimal128;
  subTotal: Types.Decimal128;
}

interface IVendorPayment extends Document {
  orderId: Types.ObjectId;
  vendorId: Types.ObjectId;
  amount: Types.Decimal128;
  status: string;
  items: IVendorPaymentItem[];
}

const VendorPaymentItemSchema = new Schema<IVendorPaymentItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Schema.Types.Decimal128, required: true },
  subTotal: { type: Schema.Types.Decimal128, required: true },
});

const VendorPaymentSchema = new Schema<IVendorPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  amount: { type: Schema.Types.Decimal128, required: true },
  status: { type: String, enum: ["unpaid","pending", "paid"], required: true },
  items: { type: [VendorPaymentItemSchema], required: true },  // Liste d'articles pour chaque paiement
});

const VendorPaymentModel = model<IVendorPayment>("VendorPayment", VendorPaymentSchema);

export { IVendorPayment, VendorPaymentModel };
