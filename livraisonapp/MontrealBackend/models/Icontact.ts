import { injectable } from 'inversify';
import { Schema, model, Document } from 'mongoose';

interface Icontact extends Document {
    FirstName: string;
    LastName: string;
    Email: string;
    Phone:number;
    Message : string;
}

const ContactSchema = new Schema<Icontact>({
    FirstName: { type: String, required: true },
    LastName: { type: String },
    Email: { type: String},
    Phone: { type: Number},
    Message: { type: String},
});

const ContactModel = model<Icontact>('Contact', ContactSchema);

export { Icontact, ContactModel };