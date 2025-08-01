import { injectable } from 'inversify';
import { Schema, model, Document } from 'mongoose';

interface Iadmin extends Document {
    FirstName: string;
    LastName: string;
    email: string;
    password: string;
}

const AdminSchema = new Schema<Iadmin>({
    FirstName: { type: String, required: true },
    LastName: { type: String,required: true },
    email: { type: String,required: true},
    password: { type: String,required: true},
});

const AdminModel = model<Iadmin>('Admin', AdminSchema);

export { Iadmin, AdminModel };