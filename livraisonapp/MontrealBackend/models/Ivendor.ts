import { injectable } from 'inversify';
import mongoose, { Schema, model, Document } from 'mongoose';
import { VendorRepository } from '../ServiceRepository/VendorRepository';
import bcrypt from 'bcrypt';

interface Ivendor extends Document {
    _id:mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    PhoneNo: string;
    companyName : string;
    BusinessAddress : string;
    descriptionLine1 : string;
    descriptionLine2 : string;
    productInfoLine1 :string;
    productInfoLine2 : string;
    email: string;
    password :string;
    IsActive : boolean;
    role: string;
    stripeAccountId?: string; //Ajouter par Rivah
    stripeOnboarded?: boolean; //Ajouter par Rivah
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const VendorSchema = new Schema<Ivendor>({
    firstName: {type : String,required : true},
    lastName: {type : String},
    email: {type : String,required : true},
    PhoneNo: {type : String},
    companyName : {type : String},
    BusinessAddress : {type : String},
    descriptionLine1 : {type : String},
    descriptionLine2 : {type : String},
    productInfoLine1 :{type : String},
    productInfoLine2 : {type : String},
    password : {type : String,required : true},
    IsActive: {
        type: Boolean,
      },
    role : {type : String},
    stripeAccountId: { type: String }, // <-- Ajoute le champ `stripeAccountId` ici
    stripeOnboarded: { type: Boolean, default: false },

});

VendorSchema.pre<Ivendor>('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch(error){

    }
});

const vendorModel = model<Ivendor>('Vendor', VendorSchema);

export { Ivendor, vendorModel };