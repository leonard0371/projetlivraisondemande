import { Container } from "inversify";
import { UnitOfWork } from "./Repo/UnitOfWork";
import { BaseRepository } from "./Repo/baserepository";
import { ISessionManager } from "./Repo/ISessionManager";
import { SessionManager } from "./Repo/SessionManager";
import { IUser, UserModel } from "./models/Iuser";
import { Model } from "mongoose";
import { UserRepository } from "./ServiceRepository/UserRepository";
import { Iproduct, ProductModel } from "./models/Iproducts";
import { ProductRepository } from "./ServiceRepository/ProductRepository";
import { VendorRepository } from "./ServiceRepository/VendorRepository";
import { VendorpaymentsRepository } from "./ServiceRepository/vendorpaymentsRepository";
import { Ivendor, vendorModel } from "./models/Ivendor";
import { IVendorPayment, VendorPaymentModel } from "./models/vendorPayment";
import { ContactModel, Icontact } from "./models/Icontact";
import { ContactRepository } from "./ServiceRepository/contactRepository";
import { CategoryModel, Icategories } from "./models/Icategories";
import { CategoryRepository } from "./ServiceRepository/CategoryRepository";
import { CheckoutModel, ICheckout } from "./models/ICheckout";
import { CheckoutRepository } from "./ServiceRepository/CheckoutRepository";
// import { LoginRepository } from "./ServiceRepository/loginRepository";
import { CartModel, ICart } from "./models/ICart";
import { CartRepository } from "./ServiceRepository/CartRepository";
import CartController  from "./controllers/cartController";
import { LoginRepository } from "./ServiceRepository/loginRepository";
import { AdminModel, Iadmin } from "./models/Iadmin";
import { ISoldProducts, SoldModel } from "./models/ISoldProducts";
import { SoldRepository } from "./ServiceRepository/SoldRepository";


const container = new Container();
container.bind<Model<IUser>>("UserModel").toConstantValue(UserModel);
container.bind<Model<Iproduct>>("ProductModel").toConstantValue(ProductModel);
container.bind<Model<Ivendor>>("vendorModel").toConstantValue(vendorModel);
container.bind<Model<Icontact>>("ContactModel").toConstantValue(ContactModel);
container.bind<Model<Icategories>>("CategoryModel").toConstantValue(CategoryModel);
container.bind<Model<ICheckout>>("CheckoutModel").toConstantValue(CheckoutModel);
container.bind<Model<Iadmin>>("AdminModel").toConstantValue(AdminModel);
container.bind<Model<ISoldProducts>>("SoldProducts").toConstantValue(SoldModel);
container.bind<LoginRepository>(LoginRepository).to(LoginRepository);
container.bind<Model<ICart>>("CartModel").toConstantValue(CartModel);

container.bind<Model<IVendorPayment>>("VendorPaymentModel").toConstantValue(VendorPaymentModel);






container.bind<UserRepository>(UserRepository).toSelf();
container.bind<ProductRepository>(ProductRepository).toSelf();
container.bind<VendorRepository>(VendorRepository).toSelf();
container.bind<ContactRepository>(ContactRepository).toSelf();
container.bind<CategoryRepository>(CategoryRepository).toSelf();
container.bind<CheckoutRepository>(CheckoutRepository).toSelf();
container.bind<SoldRepository>(SoldRepository).toSelf();
// container.bind<LoginRepository>(LoginRepository).toSelf();
container.bind<CartRepository>(CartRepository).toSelf();

container.bind<UnitOfWork>(UnitOfWork).toSelf();
container.bind<BaseRepository<any>>(BaseRepository).toSelf();
container.bind<ISessionManager>('ISessionManager').to(SessionManager);
container.bind<VendorpaymentsRepository>(VendorpaymentsRepository).toSelf();

export { container };
