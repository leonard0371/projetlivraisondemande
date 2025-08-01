import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { ICheckout } from '../models/ICheckout';
import { UnitOfWork } from '../Repo/UnitOfWork';
import { UserRepository } from '../ServiceRepository/UserRepository';
import { debug } from 'console';
import { CheckoutRepository } from '../ServiceRepository/CheckoutRepository';


@injectable()
export class CheckoutController {
    constructor(
        @inject(CheckoutRepository) private userRepository: CheckoutRepository,
        @inject(UnitOfWork) private unitOfWork: UnitOfWork
    ) { }

    async checkout(req: Request, res: Response): Promise<void> {
        const user: ICheckout = req.body;

        await this.unitOfWork.start();
        try {
            const repoWithSession = this.unitOfWork.getRepository<ICheckout>(this.userRepository);
            const newUser = await repoWithSession.create(user);
            await this.unitOfWork.complete();
            res.status(200).json(newUser);
        } catch (error: any) {
            await this.unitOfWork.abort();
            res.status(500).json({ error: error.message });
        }
    }

    async getOrderInfo(req: Request, res: Response): Promise<void> {
        await this.unitOfWork.start();
        try {
            debugger;
            const repoWithSession = this.unitOfWork.getRepository<ICheckout>(this.userRepository);
            const users = await repoWithSession.getAll();
            await this.unitOfWork.complete();
            res.status(200).json(users);
        } catch (error: any) {
            await this.unitOfWork.abort();
            res.status(500).json({ error: error.message });
        }
    }

}
