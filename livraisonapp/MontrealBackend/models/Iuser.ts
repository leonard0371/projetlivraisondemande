import { injectable } from 'inversify';
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    firstName: string;
    email: string;
    password : string;
    contactNumber: string;
    role:string;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    email: { type: String, required: true},
    password : {type : String, required: true},
    contactNumber: { type: String, required: true },
    role:{type:String, required: true}

});
UserSchema.pre<IUser>('save', async function(next) {
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

const UserModel = model<IUser>('Users', UserSchema);

export { IUser, UserModel };