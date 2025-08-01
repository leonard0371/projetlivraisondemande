import mongoose, { Model, ClientSession, UpdateQuery } from 'mongoose';
import { IBaseRepository } from './IBaseRepository';
import { injectable } from 'inversify';

@injectable()
export class BaseRepository<T> implements IBaseRepository<T> {
    private model: Model<T>;
    private session: ClientSession | null = null;

    constructor(model: Model<T>) {
        this.model = model;
    }

    setSession(session: ClientSession): void {
        this.session = session;
        // console.log(this.session)
    }
    

    async getAll(): Promise<T[]> {
        return this.model.find().session(this.session).exec();
    }

    async getById(id: string): Promise<T | null> {
        return this.model.findById(id).session(this.session).exec();
    }

    async create(entity: T): Promise<T> {
        const [createdEntity] = await this.model.create([entity], { session: this.session });
        return createdEntity;
    }

    async update(id: string, entity: Partial<T>): Promise<T | null> {
        const result = await this.model.findByIdAndUpdate(id, entity as UpdateQuery<T>, { new: true }).session(this.session).exec();
        return result as T | null;
    }
    async findByIdAndUpdate(id: string, update: UpdateQuery<T>, options?: { new: true }): Promise<T | null> {
        const result = await this.model.findByIdAndUpdate(id, update, options).session(this.session).exec();
        return result as T | null;
    }

    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id).session(this.session).exec();
    }

    async find(query: Partial<T>): Promise<T[]> {
        return this.model.find(query).session(this.session).exec();
    }
    async updateOne(query: Partial<T>, update: Partial<T>): Promise<void> {
        await this.model.updateOne(query, update).session(this.session).exec();
    }
    async findOne(query: Partial<T>): Promise<T | null> {
        return this.model.findOne(query).session(this.session).exec();
    }
    async findById(id:  mongoose.Types.ObjectId): Promise<T | null> {
        return this.model.findById(id).session(this.session).exec();
    }
    async sort(query: Partial<T>, sortBy: Record<string, 1 | -1>): Promise<T[]> {
        return this.model.find(query).sort(sortBy).session(this.session).exec();
    }
}
