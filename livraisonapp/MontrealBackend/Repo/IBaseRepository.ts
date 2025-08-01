import mongoose, { ClientSession } from "mongoose";

export interface IBaseRepository<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(entity: T): Promise<T>;
    update(id: string, entity: T): Promise<T | null>;
    delete(id: string): Promise<void>;
    setSession(session: ClientSession): void;
    find(query: Partial<T>): Promise<T[]>;
    findOne(query: Partial<T>): Promise<T | null>;
    updateOne(query: Partial<T>, update: Partial<T>): Promise<void>;
    findById(id: mongoose.Types.ObjectId): Promise<T | null>;

}
