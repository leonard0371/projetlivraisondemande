import { AdminModel, Iadmin } from "../models/Iadmin";
import { IUser, UserModel } from "../models/Iuser";
import { Ivendor, vendorModel } from "../models/Ivendor";


export class LoginRepository {
  
  async findUserByEmail(email: string, userType: string): Promise<Ivendor | Iadmin | IUser | null> {
    switch (userType) {
      case 'vendor':
        return vendorModel.findOne({ email }).exec();
      case 'admin':
        return AdminModel.findOne({ email }).exec();
      case 'user':
        return UserModel.findOne({ email }).exec();
      default:
        throw new Error('Invalid user type');
    }
  }
}
