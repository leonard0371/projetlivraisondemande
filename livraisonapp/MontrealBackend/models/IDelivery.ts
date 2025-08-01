import { Schema, model, Document } from 'mongoose';

export interface IDelivery extends Document {
  vendorId: Schema.Types.ObjectId;
  driverId?: Schema.Types.ObjectId;
  pickupAddress: string;
  deliveryAddress: string;
  clientName: string;
  clientPhoneNumber: string;
  productDetails: string;
  status: 'pending' | 'accepted';
  requestTimestamp: Date;
  deliveryTimestamp?: Date;
}

const deliverySchema = new Schema<IDelivery>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  clientName: { type: String, required: true },
  clientPhoneNumber: { type: String, required: true },
  productDetails: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
  requestTimestamp: { type: Date, default: Date.now },
  deliveryTimestamp: { type: Date },
});

export const DeliveryModel = model<IDelivery>('Delivery', deliverySchema); 