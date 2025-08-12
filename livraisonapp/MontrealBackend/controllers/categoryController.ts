import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { UnitOfWork } from '../Repo/UnitOfWork';
import { CategoryRepository } from '../ServiceRepository/CategoryRepository';
import { ProductRepository } from '../ServiceRepository/ProductRepository';

@injectable()
export class CategoryController {
  constructor(
    @inject(CategoryRepository) private categoryRepository: CategoryRepository,
    @inject(ProductRepository) private productRepository: ProductRepository,
    @inject(UnitOfWork) private unitOfWork: UnitOfWork
  ) {}

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = {
        "🥛Produits laitiers": ["Yogurt", "Sans lactose", "Lait"],
        "Boulangerie": ["Chocolatine", "Gateaux", "Pain baguette"],
        "Fruit et légumes": ["Fruits", "Legumes"],
        "Viandes et Charcuteries": ["Handmade Jewelry", "Pottery & Ceramics", "Knitted & Sewn Goods", "Woodwork & Leathercraft", "Artisan Home Decor"],
        "Plats préparés": ["Cuisine canadienne", "Cuisine francaise", "Cuisine algerienne", "Cuisine marocaine"],
        // "🍪 Food & Snacks": ["Food Essential", "Homemade Goods", "Gym Fuel", "Sweets", "Healthy Snacks"],
        // "♻️ Thrift & Secondhand": ["Secondhand Fashion", "Upcycled Goods", "Eco-Friendly Products", "Books", "Equipment", "Other"],
        // "🎨 Art & Collectibles": ["Artwork", "Prints & Posters", "Trading Cards", "Pop Culture Items", "Vintage Collectibles"],
        // "📚 Books": ["Fiction", "Non-fiction", "Textbooks", "Educational", "Comics & Graphic Novels", "Children's Books", "Special Editions & Collectibles"],
        // "Haven Spotlight": ["Featured Haven Vendors", "Haven Brands"],
        // HomeServices:["Plumbing", "Landscaping", "Others"],
        // Services: [
        //   "Home services",
        //   "Handmade Crafts",
        //   "Tutoring",
        //   "Freelancing",
        //   "Fitness Training",
        //   "Digital Services",
        // ],
        // Events: ["Parties", "Conference", "Networking", "Seminars", "Festival", "Concerts", "Sporting", "Health and Wellness", "Marriage"]
      };
      res.status(200).json({ categories });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    const { categoryId } = req.params;

    if (!categoryId) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }

    await this.unitOfWork.start();
    try {
      const objectId = new mongoose.Types.ObjectId(categoryId);
      const products = await this.productRepository.getProductsByCategory(objectId);
      await this.unitOfWork.complete();
      res.status(200).json({ products });
    } catch (error: any) {
      await this.unitOfWork.abort();
      res.status(500).json({ error: error.message });
    }
  }
}
