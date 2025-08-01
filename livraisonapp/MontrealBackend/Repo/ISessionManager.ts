import { ClientSession } from "mongoose";

export interface ISessionManager {
    openSession(): Promise<void>;
    closeSession(): Promise<void>;
    getSession(): ClientSession | null;
}