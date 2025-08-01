import { Router } from "express";
import { container } from "../inversify.config";
import { ContactController } from "../controllers/contactController";



const contactRouter = Router();

const contactController = container.resolve(ContactController);
// 

contactRouter.post('/contact', contactController.createContact.bind(contactController));

export { contactRouter };



