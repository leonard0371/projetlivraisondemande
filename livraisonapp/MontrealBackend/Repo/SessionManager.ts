import mongoose, { ClientSession } from "mongoose";
import { ISessionManager } from "./ISessionManager";
import { injectable } from "inversify";
require('dotenv').config();
@injectable()
export class SessionManager implements ISessionManager {
    private session: ClientSession | null = null;

    async openSession(): Promise<void> {
        try {
            if (mongoose.connection.readyState === 0) {
                  console.log("Connecting to MongoDB with URI:", process.env.MONGODB_CONNECTION_STRING);
                await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`);
                console.log('Database connection opened');
            }

            if (!this.session) {
                this.session = await mongoose.startSession();
                console.log('Session opened');
            }
        } catch (error) {
            console.error('Error opening session: ', error);
        }
    }

    async closeSession(): Promise<void> {
        try {
            if (this.session) {
                await this.session.endSession(); 
                this.session = null; 
                // console.log('Session closed');
            }
        } catch (error) {
            console.error('Error closing session: ', error);
        }
    }

    getSession(): ClientSession | null {
        if (this.session && this.session.inTransaction()) {
            return this.session;
        } else {
            //console.warn('Attempting to use an ended session');
            return null;
        }
    }

    async withSession(callback: (session: ClientSession) => Promise<void>) {
        if (!this.session) {
            await this.openSession(); 
        }

        if (this.session) {
            try {
                await this.session.withTransaction(async () => {
                    await callback(this.session!); 
                });
            } catch (error) {
                console.error('Transaction error: ', error);
            } finally {
                await this.closeSession();
            }
        }
    }
}
