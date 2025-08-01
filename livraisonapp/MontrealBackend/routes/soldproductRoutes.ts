import { Router } from "express";
import { container } from "../inversify.config";
import { SoldController } from "../controllers/soldController";
import { authenticateToken } from "../Middleware/TokenMiddleware";


const soldRouter = Router();

const soldController = container.resolve(SoldController);

soldRouter.post('/soldproducts', soldController.createSoldProduct.bind(soldController));
soldRouter.get('/soldproducts',
    // authenticateToken,
     soldController.getallsoldProducts.bind(soldController));
soldRouter.get('/getSoldProductsByVendorId/:vendorId', soldController.getSoldProductsByVendorID.bind(soldController));


export { soldRouter };