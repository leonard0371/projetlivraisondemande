import { Router } from 'express';
import { container } from '../inversify.config';
import { ProductController } from '../controllers/productcontroller';
import path from 'path';

import { Request, Response } from 'express';
import multer from 'multer';
// const multer  = require('multer')

const productRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const productController = container.resolve(ProductController);
productRouter.post('/upload', upload.single('image'), async (req: Request, res: Response) => productController.createProduct(req, res));
productRouter.get('/products', productController.getallproducts.bind(productController));
// productRouter.post('/createproducts', upload.single('productImage'), productController.createProduct.bind(productController));
productRouter.post('/createproducts', upload.array('productImage', 4), productController.createProduct.bind(productController));
productRouter.post('/updateproducts', upload.array('productImage',4), productController.updateProduct.bind(productController));
productRouter.delete('/deleteproduct', productController.deleteProduct.bind(productController));
productRouter.get('/products/vendor/:vendorId', productController.getProductOnVendorID.bind(productController));
productRouter.get('/products/category/:subcategory', productController.getProductsByCategory.bind(productController));
productRouter.get('/products/:name', productController.searchProductsByName.bind(productController));
productRouter.get('/productsById/:id', productController.getProductsById.bind(productController));


export { productRouter };
