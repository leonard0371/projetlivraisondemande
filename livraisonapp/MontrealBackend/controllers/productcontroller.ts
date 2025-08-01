import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { UnitOfWork } from "../Repo/UnitOfWork";
import { ProductRepository } from "../ServiceRepository/ProductRepository";
import { Iproduct } from "../models/Iproducts";
import { json } from "body-parser";
import mongoose from "mongoose";
import { VendorRepository } from "../ServiceRepository/VendorRepository";
import { Ivendor } from "../models/Ivendor";
const stripe = require("stripe")(process.env.Stripe_Secret_key);

@injectable()
export class ProductController {
  constructor(
    @inject(ProductRepository) public productRepository: ProductRepository,
    @inject(VendorRepository) public vendorRepository: VendorRepository,
    @inject(UnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  async createProduct(req: Request, res: Response): Promise<void> {
    debugger;
  
    try {
      // console.log(req.body, 'filesfiles');
  
      const productData = JSON.parse(req.body.product);
  
      if (req.files && Array.isArray(req.files)) {
        if (req.files.length > 4) {
          console.log(req.files.length,"req.files.length")
           res.status(400).json({ error: "You cannot upload more than 4 files." });
           return;
          }
  
        const images = (req.files as Express.Multer.File[]).map(
          (file) => `/uploads/${file.filename}`
        );
  
        if (!productData.images) {
          productData.images = [];
        }
  
        productData.images.push(...images);
        // console.log('images', images)
      }
      if (productData.quantity) {
        productData.cartQuantity = productData.quantity;
      }
      productData.vendorId = req.body.vendorId;
  
      await this.unitOfWork.start();
  
      const repoWithSession = this.unitOfWork.getRepository<Iproduct>(this.productRepository);
      const newProduct = await repoWithSession.create(productData);

      // console.log('data', newProduct)
  
      await this.unitOfWork.complete();
      res.status(200).json(newProduct);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
  
  

  async updateProduct(req: Request, res: Response): Promise<void> {
    const parsedProduct = JSON.parse(req.body.product);
    const id = parsedProduct._id;

    if (!id) {
        res.status(400).json({ error: "Product ID is required" });
        return;
    }

    await this.unitOfWork.start();

    try {
        const repoWithSession = this.unitOfWork.getRepository<Iproduct>(this.productRepository);

        const existingProduct = await repoWithSession.findById(id);
        if (!existingProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const newImages = (req.files as Express.Multer.File[]).map(
                (file) => `/uploads/${file.filename}`
            );

            parsedProduct.images = newImages;
        } else {
            parsedProduct.images = existingProduct.images;
        }
        if (parsedProduct.quantity) {
          parsedProduct.cartQuantity = parsedProduct.quantity;
        }

        const updatedProduct = await repoWithSession.update(id, parsedProduct);
        await this.unitOfWork.complete();

        res.status(200).json(updatedProduct);
    } catch (error: any) {
        await this.unitOfWork.abort();
        res.status(500).json({ error: error.message });
    }
}


  async getallproducts(req: Request, res: Response) {
    try {
      debugger;
  
      await this.unitOfWork.start();
  
      const productRepo = this.unitOfWork.getRepository<Iproduct>(this.productRepository);
      const vendorRepo = this.unitOfWork.getRepository<Ivendor>(this.vendorRepository);
  
      const allVendors = await vendorRepo.getAll(); 
      const validVendorIds = allVendors.map(vendor => vendor._id.toString());
  // console.log(validVendorIds,'valid vendor Ids')
      const products = await productRepo.getAll();
  
      const filteredProducts = products.filter(product => validVendorIds.includes(product.vendorId.toString()));
  
      // console.log(filteredProducts, 'filteredProducts');
  
      this.unitOfWork.complete();
  
      res.status(200).json(filteredProducts);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
  

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.query;
    // console.log(id, typeof id, "sdaskfkaljfa");
    if (typeof id !== "string") {
      res.status(400).json({ error: "Invalid id parameter" });
      return;
    }
    await this.unitOfWork.start();
    try {
      const repoWithSession = this.unitOfWork.getRepository<Iproduct>(
        this.productRepository
      );
      await repoWithSession.delete(id);
      await this.unitOfWork.complete();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
  async getProductOnVendorID(req: Request, res: Response): Promise<void> {
    try {
      const { vendorId } = req.params;
      // console.log(req.params, "aasdasdsd");
      await this.unitOfWork.start();

      const repoWithSession = this.unitOfWork.getRepository<Iproduct>(
        this.productRepository
      );
      const products = await repoWithSession.find({
        vendorId: String(vendorId),
      });

      await this.unitOfWork.complete();
      res.status(200).json(products);
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { subcategory } = req.params;
      // console.log('Received subcategory:', subcategory);

      if (!subcategory) {
        // console.error('Subcategory not provided');
        res.status(400).json({ error: "Subcategory not provided" });
        return;
      }

      await this.unitOfWork.start();
      // console.log('Unit of work started');

      const repoWithSession = this.unitOfWork.getRepository<Iproduct>(
        this.productRepository
      );
      if (!repoWithSession) {
        // console.error('Failed to get repository with session');
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      // console.log('Repository with session obtained');

      const products = await repoWithSession.find({ subcategory });
      if (!products || products.length === 0) {
        console.log("No products found for subcategory:", subcategory);
      } else {
        console.log("Products found:", products);
      }

      await this.unitOfWork.complete();
      // console.log('Unit of work completed');

      res.status(200).json(products);
    } catch (error: any) {
      await this.unitOfWork.abort();
      // console.error('Error while searching by subcategory:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async searchProductsByName(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      // console.log('Searching for products with name:', name);

      await this.unitOfWork.start();

      const repoWithSession = this.unitOfWork.getRepository<Iproduct>(
        this.productRepository
      );
      const products = await repoWithSession.find({
        name: { $regex: new RegExp(name, "i") },
      } as any);

      console.log("Products found:", products);

      await this.unitOfWork.complete();
      res.status(200).json(products);
    } catch (error: any) {
      await this.unitOfWork.abort();
      // console.error('Search by name error:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async getProductsById(req: Request, res: Response): Promise<void> {
    const _id: string = req.params.id;
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(_id);
      if (!_id) {
        res.status(400).json({ error: "Id not provided" });
        return;
      }

      await this.unitOfWork.start();
      const repoWithSession = this.unitOfWork.getRepository<Iproduct>(
        this.productRepository
      );

      const product = await repoWithSession.find({ _id: objectId });
      console.log(product[0].vendorId,'product sdsadsad')
      if (!product) {
        console.log("No product found for this id:", _id);
        res.status(404).json({ error: "Product not found" });
        return;
      }
let vendorId = new mongoose.Types.ObjectId(product[0].vendorId)
      const vendor = await this.vendorRepository.find({ _id: vendorId });
      const vendorDetails = vendor ? { name: vendor[0]?.firstName, email: vendor[0]?.email } : null;

      await this.unitOfWork.complete();

      res.status(200).json({
        product,
        vendor: vendorDetails
      });
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
}
