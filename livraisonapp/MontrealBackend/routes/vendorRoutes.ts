import { Router } from "express";
import { container } from "../inversify.config";
import { VendorController } from "../controllers/vendorController";



const vendorRouter = Router();

const vendorController = container.resolve(VendorController);
// 
vendorRouter.get('/vendor', vendorController.getAllVendor.bind(vendorController));

vendorRouter.post('/vendor', vendorController.createVendor.bind(vendorController));
vendorRouter.post('/updateVendor', vendorController.updateVendor.bind(vendorController));
vendorRouter.post('/update-vendor-status', vendorController.changeVendorStatus.bind(vendorController));
vendorRouter.delete('/deleteVendor', vendorController.deleteVendor.bind(vendorController));
vendorRouter.post('/vendorlogin', vendorController.loginVendor.bind(vendorController));
 



export { vendorRouter };



