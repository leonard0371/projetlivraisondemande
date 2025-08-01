// import { injectable, inject } from 'inversify';
// import { Request, Response } from 'express';
// import mongoose from 'mongoose';
// import { UnitOfWork } from '../Repo/UnitOfWork';
// import { CategoryRepository } from '../ServiceRepository/CategoryRepository';
// import { ProductRepository } from '../ServiceRepository/ProductRepository';

// @injectable()
// export class CategoryController {
//   constructor(
//     @inject(CategoryRepository) private categoryRepository: CategoryRepository,
//     @inject(ProductRepository) private productRepository: ProductRepository,
//     @inject(UnitOfWork) private unitOfWork: UnitOfWork
//   ) {}

//   async getAllRoles(req: Request, res: Response): Promise<void> {
//     await this.unitOfWork.start();
//     try {
//       const roles = [
//       {id : "667aae8acb3d3b44bb1ebff1", role : "user"},
//       {id : "667aae8acb3d3b44bb1ebff1", role : "admin"},
//       {id : "667aae8acb3d3b44bb1ebff1", role : "vendor"},

//       ];
//       await this.unitOfWork.complete();
//       res.status(200).json({ roles });
//     } catch (error: any) {
//       await this.unitOfWork.abort();
//       res.status(500).json({ error: error.message });
//     }
//   }
// }