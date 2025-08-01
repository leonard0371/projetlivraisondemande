import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ICart, CartModel } from "../models/ICart";
import { CartRepository } from "../ServiceRepository/CartRepository";
import { UnitOfWork } from "../Repo/UnitOfWork";
import mongoose from "mongoose";
import { ProductRepository } from "../ServiceRepository/ProductRepository";
import { Iproduct } from "../models/Iproducts";

@injectable()
class CartController {
  private cartRepository: CartRepository;
  private unitOfWork: UnitOfWork;

  constructor(
    @inject(CartRepository) cartRepository: CartRepository,
    @inject(ProductRepository) private productRepository: ProductRepository,
    @inject(UnitOfWork) unitOfWork: UnitOfWork
  ) {
    this.cartRepository = cartRepository;
    this.unitOfWork = unitOfWork;
  }

  async addCart(req: Request, res: Response): Promise<void> {
    const { userId, products } = req.body;

    if (!products || products.length === 0) {
      res.status(400).json({ error: "UserId and products are required" });
      return;
    }

    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    // console.log('object userid', objectIdUserId);
    // console.log('products Test', products)

    await this.unitOfWork.start();
    try {
      const repoWithSession = this.unitOfWork.getRepository<ICart>(
        this.cartRepository
      );
      const productRepoWithSession = this.unitOfWork.getRepository<Iproduct>(
        this.productRepository
      );

      const existingCart = await repoWithSession.findOne({
        userId: objectIdUserId,
      });
      // console.log('existing cart', existingCart)

      for (const product of products) {
        const productDetails = await productRepoWithSession.findById(
          product.productId
        );
        // console.log('product details', productDetails)

        if (!productDetails) {
          res
            .status(404)
            .json({ error: `Product with ID ${product.productId} not found` });
          return;
        }
        const stockAvailable= productDetails.quantity;

        // quantité déjà dans le panier
        let currentInCart = 0;
        // if(existingCart)
        // console.log('stock Available', stockAvailable)

        if(existingCart){
          const item = existingCart.products.find(p => p.productId.toString() === product.productId);
          // console.log('item', item)
          // console.log('item quantity', item?.quantity)
          currentInCart = item ? item.quantity : 0;
          // console.log('current In cart', currentInCart)
        }
     
        const newTotal = currentInCart + product.quantity;

        if (newTotal > stockAvailable) {
          res.status(400).json({
            error: `Cannot add ${product.quantity} more of ${productDetails.name}. Only ${stockAvailable - currentInCart} left in stock.`,
          });
          return;
        }
      

    }


    // Ajout ou mise à jour dans le panier de l'utilisateur
      if (existingCart) {
        for (const product of products) {
          const existingProduct = existingCart.products.find(
            (cartProduct: any) =>
              cartProduct.productId.toString() === product.productId.toString()
          );

          if (existingProduct) {
            existingProduct.quantity += product.quantity;
            existingProduct.subTotal = existingProduct.quantity * product.price;
          } else {
            existingCart.products.push({
              ...product,
              cartId: objectIdUserId,
            });
          }
        }

        // await repoWithSession.create(existingCart);
        await repoWithSession.update((existingCart._id as mongoose.Types.ObjectId).toString(), existingCart);


        res.status(200).json(existingCart);
      } else {
        const cartData = new CartModel({
          userId: objectIdUserId,
          products: products.map((product: any) => ({
            ...product,
          })),
        });

        const newCart = await repoWithSession.create(cartData);
        res.status(200).json(newCart);
      }

      await this.unitOfWork.complete();
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }


  async updateCart(req: Request, res: Response): Promise<void> {
    const cart: ICart = req.body;
    // console.log(req.body.IsActive, "IsActiveIsActiveIsActive");
    const id = req.body._id;
    // console.log(id, cart, "cartupdatemethod");
    await this.unitOfWork.start();
    try {
      const repoWithSession = this.unitOfWork.getRepository<ICart>(
        this.cartRepository
      );
      const newProduct = await repoWithSession.update(id, cart);
      // console.log(newProduct, "newProductnewProduct");
      await this.unitOfWork.complete();
      res.status(200).json(newProduct);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }


  async getCart(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.userId;
    let objectIdUserId;

    try {
        objectIdUserId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
        res.status(400).json({ error: "Invalid userId format" });
        return;
    }

    await this.unitOfWork.start();
    try {
        const repoWithSession = this.unitOfWork.getRepository<ICart>(this.cartRepository);
        const productRepoWithSession = this.unitOfWork.getRepository<Iproduct>(this.productRepository);

        const cartItems = await CartModel.find({
            userId: objectIdUserId,
        }).populate("products.productId");

        const currentTime = new Date();
        let cartUpdated = false;

        for (const cart of cartItems) {
            const updatedProducts: typeof cart.products = []; 

            for (const product of cart.products) {
                const productTime = new Date(product.CreatedOn);
                const timeDifference = currentTime.getTime() - productTime.getTime();
                const hoursDifference = timeDifference / (1000 * 60 * 60);

                if (hoursDifference > 24) { 
                    // console.log('Product is older than 24 hours');

                    const productDetails = await productRepoWithSession.findById(product.productId);
                    if (productDetails) {
                      const cartQuantity = productDetails.cartQuantity += product.quantity;
                      // console.log(cartQuantity,'cartQuantitycartQuantity')

                        await productRepoWithSession.updateOne(
                            { _id: product.productId },
                            { cartQuantity: cartQuantity }
                        );
                    }

                    cartUpdated = true;
                } else {
                    updatedProducts.push(product);
                }
            }

            if (cartUpdated) {
                await CartModel.findByIdAndUpdate(
                    cart._id,
                    {
                        products: updatedProducts
                    }
                );
            }
        }

        await this.unitOfWork.complete();
        res.status(200).json(cartItems);
    } catch (error: any) {
        await this.unitOfWork.abort();
        res.status(500).json({ error: error.message });
    }
}

  async deleteCartProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.query;
    console.log('id cart', id)

    if (typeof id !== "string") {
        res.status(400).json({ error: "Invalid id parameter" });
        return;
    }

    const objectId = new mongoose.Types.ObjectId(id);
    await this.unitOfWork.start();

    try {
        const repoWithSession = this.unitOfWork.getRepository<ICart>(this.cartRepository);
        const productRepoWithSession = this.unitOfWork.getRepository<Iproduct>(this.productRepository);

        const carts = await repoWithSession.getAll();
        let productExists = false;

        for (const cart of carts) {
            const updatedProducts: typeof cart.products = [];

            for (const product of cart.products) {
                if (product._id?.toString() === objectId.toString()) {
                    productExists = true;

                    const productDetails = await productRepoWithSession.findById(product.productId);

                    if (productDetails) {
                        const cartQuantity = productDetails.cartQuantity += product.quantity;

                        await productRepoWithSession.updateOne(
                            { _id: product.productId },
                            { cartQuantity: cartQuantity }
                        );
                    }

                } else {
                    updatedProducts.push(product);
                }
            }

            // if (productExists) {
            //     await repoWithSession.update(cart._id, {
            //         ...cart.toObject(),
            //         products: updatedProducts,
            //     });
            // }
            if (productExists) {
              await CartModel.findByIdAndUpdate(
                  cart._id,
                  {
                      products: updatedProducts
                  }
              );
          }
        }

        if (productExists) {
            res.status(200).json({ message: "Product removed from cart and quantity updated in inventory" });
        } else {
            res.status(404).json({ error: "Product not found in any cart" });
        }

        await this.unitOfWork.complete();
    } catch (error: any) {
        await this.unitOfWork.abort();
        res.status(500).json({ error: error.message });
    }
}

}
export default CartController;

function se(value: ICart, index: number, array: ICart[]): void {
  throw new Error("Function not implemented.");
}
