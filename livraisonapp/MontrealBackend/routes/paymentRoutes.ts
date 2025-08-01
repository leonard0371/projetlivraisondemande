import { Router } from "express";
import { container } from "../inversify.config";
import { PaymentController } from "../controllers/paiementController";



const paymentRouter = Router();

const paymentController = container.resolve(PaymentController);
// 
paymentRouter.get('/vendorUnPaid', paymentController.getAllVendorUnpaid.bind(paymentController));

// vendorRouter.post('/vendor', vendorController.createVendor.bind(vendorController));
// vendorRouter.post('/updateVendor', vendorController.updateVendor.bind(vendorController));
// vendorRouter.post('/update-vendor-status', vendorController.changeVendorStatus.bind(vendorController));
// vendorRouter.delete('/deleteVendor', vendorController.deleteVendor.bind(vendorController));
// vendorRouter.post('/vendorlogin', vendorController.loginVendor.bind(vendorController));
 



export { paymentRouter };



