import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUser, UserModel } from "../models/Iuser";
import { UnitOfWork } from "../Repo/UnitOfWork";
import { UserRepository } from "../ServiceRepository/UserRepository";
import { debug } from "console";
import { VendorRepository } from "../ServiceRepository/VendorRepository";
import { AdminRepository } from "../ServiceRepository/AdminRepository";
import { Ivendor } from "../models/Ivendor";
import { SoldRepository } from "../ServiceRepository/SoldRepository";
import { ISoldProducts, SoldModel } from "../models/ISoldProducts";
import mongoose from "mongoose";
import { Iproduct, ProductModel } from "../models/Iproducts";
import { ProductRepository } from "../ServiceRepository/ProductRepository";
import { ICart } from "../models/ICart";
import { CartRepository } from "../ServiceRepository/CartRepository";
import { sendEmail } from "../ServiceRepository/EmailService";

@injectable()
export class SoldController {
  constructor(
    @inject(SoldRepository) private soldRepository: SoldRepository,
    @inject(ProductRepository) private productRepository: ProductRepository,
    @inject(CartRepository) private cartRepository: CartRepository,
    @inject(VendorRepository) private vendorRepository: VendorRepository,
    @inject(UserRepository) private userRepository: UserRepository,
    @inject(UnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  async createSoldProduct(req: Request, res: Response): Promise<void> {
    const { userId, products, subTotal }: ISoldProducts = req.body;
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    await this.unitOfWork.start();

    try {
      debugger;
      const repoWithSessionSold = this.unitOfWork.getRepository<ISoldProducts>(
        this.soldRepository
      );
      const repoWithSessionProduct = this.unitOfWork.getRepository<Iproduct>(
        this.productRepository
      );
      const repoWithSessionCart = this.unitOfWork.getRepository<ICart>(
        this.cartRepository
      );
      const repoWithSessionVendor = this.unitOfWork.getRepository<Ivendor>(
        this.vendorRepository
      );
      const repoWithSessionUser = this.unitOfWork.getRepository<IUser>(
        this.userRepository
      );

      if (products?.length <= 0) {
        res.status(400).json({ error: "No products found" });
        return;
      }

      const productsWithVendorId = await Promise.all(
        products.map(async (product) => {
          const productDetails = await repoWithSessionProduct.findById(
            product.productId
          );

          if (!productDetails) {
            throw new Error(`Product with ID ${product.productId} not found`);
          }

          if (productDetails.quantity < product.quantity) {
            throw new Error(`Insufficient quantity for ${product.name}`);
          }

          const updatedQuantity = productDetails.quantity - product.quantity;

          await repoWithSessionProduct.updateOne(
            { _id: product.productId },
            { quantity: updatedQuantity },
          );

          return {
            ...product,
            vendorId: productDetails.vendorId,
          };
        })
      );
      const findUserEmail = await repoWithSessionUser.findById(userId);
      // let myObject: object | null = findUserEmail;
      console.log(findUserEmail?.email, "findUserEmail");
      const emailString: any = findUserEmail?.email;

      const vendorEmails: string[] = [];
      for (const product of productsWithVendorId) {
        try {
          const vendorId = new mongoose.Types.ObjectId(product.vendorId);
          const vendor = await repoWithSessionVendor.findById(vendorId);
          if (vendor) {
            vendorEmails.push(vendor.email);
          }
        } catch (error) {
          throw new Error(`Vendor with ID ${product.vendorId} not found`);
        }
      }

      const itemData = new SoldModel({
        userId: objectIdUserId,
        subTotal,
        products: productsWithVendorId,
      });

      const newItem = await repoWithSessionSold.create(itemData);

      const cartItems = await repoWithSessionCart.find({
        userId: objectIdUserId,
      });

      for (const cartItem of cartItems) {
        const cartItemId = cartItem._id as mongoose.Types.ObjectId;
        await repoWithSessionCart.delete(cartItemId.toString());
      }

      await this.unitOfWork.complete();

      for (const email of vendorEmails) {
        await sendEmail(
          email,
          "Product Sold Notification",
          'Montreal Haven',
          "A product has been sold from your store."
        );
      }
      if (res.status(200)) {
        await sendEmail(
          emailString,
          "Order Placed Successfully",
          'Montreal Haven',
          `Your order at Montreal Haven has been placed successfully`
        );
      }

      res.status(200).json(newItem);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }

  async getallsoldProducts(req: Request, res: Response) {
    try {
      await this.unitOfWork.start();
      const repoWithSession = this.unitOfWork.getRepository<ISoldProducts>(
        this.soldRepository
      );
      const products = await repoWithSession.getAll();

      console.log(products, "soldproducts");
      const totalSubTotal = products.reduce((acc, current) => {
        const subTotal = current.subTotal || 0;
        return acc + subTotal;
      }, 0);
      // console.log("totalSubTotal");
      const calcPercentage =  totalSubTotal * 0.03;
      console.log(calcPercentage, totalSubTotal, "calcPercentage");
      this.unitOfWork.complete();
      res.status(200).json({ calcPercentage, products });
    } catch (error: any) {
      await this.unitOfWork.abort();
      // console.log(error);
      res.status(500).json({ error: error.message });
    }
  }

  async getSoldProductsByVendorID(req: Request, res: Response) {
    try {
      const vendorId = new mongoose.Types.ObjectId(req.params.vendorId);

      await this.unitOfWork.start();
      const repoWithSession = this.unitOfWork.getRepository<ISoldProducts>(
        this.soldRepository
      );

      const allSoldProducts = await repoWithSession.getAll();

      let totalSubTotalForVendor = 0;

      const filteredSoldProducts = allSoldProducts
        .map((soldProduct) => {
          const clonedSoldProduct = JSON.parse(JSON.stringify(soldProduct));

          const filteredProducts = clonedSoldProduct.products.filter(
            (p: Iproduct) =>
              p.vendorId &&
              new mongoose.Types.ObjectId(p.vendorId).equals(vendorId)
          );

          const vendorSubTotal = filteredProducts.reduce(
            (sum: number, product: { price: number; quantity: number }) => {
              return sum + product.price * product.quantity;
            },
            0
          );

          totalSubTotalForVendor += vendorSubTotal;

          if (filteredProducts.length > 0) {
            clonedSoldProduct.products = filteredProducts;
            clonedSoldProduct.subTotal = vendorSubTotal;
            return clonedSoldProduct;
          }

          return null;
        })
        .filter(Boolean);

      const calcPercentage = totalSubTotalForVendor * 0.97;

      await this.unitOfWork.complete();

      res.status(200).json({
        calcPercentage,
        subTotal: totalSubTotalForVendor,
        products: filteredSoldProducts,
      });
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }

  // async getSoldProductsByVendorID(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { vendorId } = req.params;
  //     console.log(req.params, "In VendorId Call");
  //     await this.unitOfWork.start();
  //     const repoWithSession = this.unitOfWork.getRepository<Iproduct>(
  //       this.productRepository
  //     );
  //     const repoWithSessionVendor = this.unitOfWork.getRepository<ISoldProducts>(
  //       this.soldRepository
  //     )
  //     // const vendorproducts = await repoWithSessionVendor.find({vendorId: String(vendorId),});
  //     // console.log(vendorproducts, "get by vendorId");

  //     const products = await repoWithSession.find({
  //       vendorId: String(vendorId),
  //     });

  //     await this.unitOfWork.complete();
  //     res.status(200).json(products);
  //   } catch (error: any) {
  //     await this.unitOfWork.abort();
  //     res.status(500).json({ error: error.message });
  //   }
  // }
  // async getallsoldProducts(req: Request, res: Response) {
  //   try {
  //     await this.unitOfWork.start();
  //     const repoWithSession = this.unitOfWork.getRepository<ISoldProducts>(this.soldRepository);

  //     const products = await repoWithSession.getAll();

  //     const populatedProducts = await Promise.all(
  //       products.map(async (soldProduct) => {
  //         console.log(soldProduct,'soldProduct')
  //         const populatedItems = await Promise.all(
  //           soldProduct.products.map(async (item) => {
  //             const productDetails = await ProductModel.findById(item.productId).exec();
  //             return {
  //               ...item,
  //               productId: productDetails,
  //             };
  //           })
  //         );
  //         return {
  //           ...soldProduct,
  //           products: populatedItems,
  //         };
  //       })
  //     );
  // console.log(populatedProducts,'populatedProducts')
  //     const totalSubTotal = populatedProducts.reduce((acc, current) => {
  //       const subTotal = current.subTotal || 0;
  //       return acc + subTotal;
  //     }, 0);

  //     const calcPercentage = (totalSubTotal * 5) / 100;
  //     console.log(calcPercentage, 'totalSubTotal');

  //     this.unitOfWork.complete();

  //     res.status(200).json({ totalSubTotal, products: populatedProducts });
  //   } catch (error: any) {
  //     await this.unitOfWork.abort();
  //     res.status(500).json({ error: error.message });
  //   }
  // }
}
