import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IUser, UserModel } from '../models/Iuser';
import { UnitOfWork } from '../Repo/UnitOfWork';
import { UserRepository } from '../ServiceRepository/UserRepository';
import { debug } from 'console';
import { VendorRepository } from '../ServiceRepository/VendorRepository';
import { AdminRepository } from '../ServiceRepository/AdminRepository';
import { Ivendor } from '../models/Ivendor';


@injectable()
export class UserController {
    constructor(
        @inject(UserRepository) private userRepository: UserRepository,
        @inject(UnitOfWork) private unitOfWork: UnitOfWork,
        // @inject(UserRepository) private userRepository: UserRepository,
        @inject(VendorRepository) private vendorRepository: VendorRepository
    ) { }

    // async createUser(req: Request, res: Response): Promise<void> {
    //     const user: IUser = req.body;
    //     await this.unitOfWork.start();
    //     try {
    //         const repoWithSession = this.unitOfWork.getRepository<IUser>(this.userRepository);
    //         const newUser = await repoWithSession.create(user);
    //         await this.unitOfWork.complete();
    //         res.status(200).json(newUser);
    //     } catch (error: any) {
    //         await this.unitOfWork.abort();
    //         res.status(500).json({ error: error.message });
    //     }
    // }
    async createUser(req: Request, res: Response): Promise<void> {
        const user: IUser = req.body;
        await this.unitOfWork.start();
        try {
            const repoWithSession = this.unitOfWork.getRepository<IUser>(this.userRepository);
            const vendorRepoWithSession = this.unitOfWork.getRepository<Ivendor>(this.vendorRepository)
            // repoWithSession.setSession(this.unitOfWork.getSession());
            const existingUser = await repoWithSession.find({ email: user.email });
            const existingVendor = await vendorRepoWithSession.find({email:user.email});
            if (existingUser.length > 0 || existingVendor.length > 0) {
                res.status(400).json({ error: 'Email already exists' });
                return;
            }
            const newUser = await repoWithSession.create(user);
            await this.unitOfWork.complete();
            res.status(200).json(newUser);
        } catch (error: any) {
            await this.unitOfWork.abort();
            res.status(500).json({ error: error.message });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        await this.unitOfWork.start();
        try {
            debugger;
            const repoWithSession = this.unitOfWork.getRepository<IUser>(this.userRepository);
            const users = await repoWithSession.getAll();
            const filterUsers = users.filter((roles)=>roles.role !== "admin")
            await this.unitOfWork.complete();
            res.status(200).json(filterUsers);
        } catch (error: any) {
            await this.unitOfWork.abort();
            res.status(500).json({ error: error.message });
        }
    }
    async getUserByID(req: Request, res: Response): Promise<void> {
      const {id} = req.params;
      // console.log(id,'idididididid')
      
        await this.unitOfWork.start();
        try {
            debugger;
            const repoWithSession = this.unitOfWork.getRepository<IUser>(this.userRepository);
            const users = await repoWithSession.find({id});
            // console.log(users,'usersByID')
            await this.unitOfWork.complete();
            res.status(200).json(users);
        } catch (error: any) {
            await this.unitOfWork.abort();
            res.status(500).json({ error: error.message });
        }
    }
    async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.query;
        console.log(id, "sdaskfkaljfa");
        if (typeof id !== "string") {
          res.status(400).json({ error: "Invalid id parameter" });
          return;
        }
        await this.unitOfWork.start();
        try {
          const repoWithSession = this.unitOfWork.getRepository<IUser>(
            this.userRepository
          );
          await repoWithSession.delete(id);
          await this.unitOfWork.complete();
          res.status(200).json({ message: "User deleted successfully" });
        } catch (error: any) {
          await this.unitOfWork.abort();
          res.status(500).json({ error: error.message });
        }
      }
      async updateUser(req: Request, res: Response): Promise<void> {
        const product: IUser= req.body;
        // console.log(req.body._id, "req.body._id");
        const id = req.body._id;
        await this.unitOfWork.start();
        try {
          const repoWithSession = this.unitOfWork.getRepository<IUser>(
            this.userRepository
          );
          const newUser = await repoWithSession.update(id, product);
          await this.unitOfWork.complete();
          res.status(200).json(newUser);
        } catch (error: any) {
          await this.unitOfWork.abort();
          res.status(500).json({ error: error.message });
        }
      }
}
