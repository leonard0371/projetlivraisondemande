import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { UnitOfWork } from '../Repo/UnitOfWork';
import { ContactRepository } from '../ServiceRepository/contactRepository'
import { Iproduct } from '../models/Iproducts';
import { Icontact } from '../models/Icontact';


@injectable()
export class ContactController {
    constructor(
        @inject(ContactRepository) public contactRepository: ContactRepository,
        @inject(UnitOfWork) private unitOfWork: UnitOfWork
    ) { }

    async createContact(req: Request, res: Response): Promise<void> {
        const contact: Icontact = req.body;

        await this.unitOfWork.start();
        try {
            const repoWithSession = this.unitOfWork.getRepository<Icontact>(this.contactRepository);
            const newContact = await repoWithSession.create(contact);
            await this.unitOfWork.complete();
            res.status(200).json(newContact);
        } catch (error: any) {
            await this.unitOfWork.abort();
            res.status(500).json({ error: error.message });
        }
    }
    // async getallproducts(req: Request, res: Response)
    // {
    //     await this.unitOfWork.start();
    //     try {
    //         debugger;
    //         const repoWithSession = this.unitOfWork.getRepository<Iproduct>(this.productRepository);
    //         const products = await repoWithSession.getAll();
    //         await this.unitOfWork.complete();
    //         res.status(200).json(products);
    //     } catch (error: any) {
    //         await this.unitOfWork.abort();
    //         res.status(500).json({ error: error.message });
    //     }
    // }
  
}