import { Router } from "express";
import { container } from "../inversify.config";
import  CartController  from "../controllers/cartController";



const cartRouter = Router();

const cartController = container.resolve(CartController);

cartRouter.post('/cart', cartController.addCart.bind(cartController));
cartRouter.post('/updatecart', cartController.updateCart.bind(cartController));
cartRouter.get('/cart/:userId', cartController.getCart.bind(cartController));
cartRouter.delete('/deleteCartProducts', cartController.deleteCartProduct.bind(cartController));

export { cartRouter };