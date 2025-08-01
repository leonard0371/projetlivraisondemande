import { Router } from "express";
import { container } from "../inversify.config";
import { ContactController } from "../controllers/contactController";
import { CategoryController } from "../controllers/categoryController";
import { CheckoutController } from "../controllers/checkoutController";



const checkoutRouter = Router();

const checkoutController = container.resolve(CheckoutController);
// 

checkoutRouter.get('/checkout', checkoutController.getOrderInfo.bind(checkoutController));
checkoutRouter.post('/checkout', checkoutController.checkout.bind(checkoutController));


export { checkoutRouter };



