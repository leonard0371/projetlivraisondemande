import { Router } from "express";
import { container } from "../inversify.config";
import { ContactController } from "../controllers/contactController";
import { CategoryController } from "../controllers/categoryController";



const categoryRouter = Router();

const categoryController = container.resolve(CategoryController);
// 

categoryRouter.get('/category', categoryController.getAllCategories.bind(categoryController));
categoryRouter.get('/categories/:categoryId/products', (req, res) => categoryController.getProductsByCategory(req, res));
export { categoryRouter };



