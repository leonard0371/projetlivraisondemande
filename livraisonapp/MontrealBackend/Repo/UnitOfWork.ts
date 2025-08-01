import { inject, injectable } from 'inversify';
import { ClientSession, startSession } from 'mongoose';
import { SessionManager } from './SessionManager';
import { IBaseRepository } from './IBaseRepository';
import { ISessionManager } from './ISessionManager';

@injectable()
export class UnitOfWork  {
    private session: ClientSession | null = null;
    constructor(
        @inject("ISessionManager") private sessionManager: ISessionManager
    ) { }

  
    async start(): Promise<void> {
        await this.sessionManager.openSession();
        this.session = this.sessionManager.getSession();
        // console.log('Session started');
    }

    async complete(): Promise<void> {
        if (this.session) {
            try {
                await this.sessionManager.closeSession();
                console.log('Session closed');
            } catch (error : any) {
                if (error.name === 'MongoExpiredSessionError') {
                    console.error('Session expired before completion.');
                } else {
                    throw error;
                }
            } finally {
                this.session = null;
                // console.log(this.session)
            }
        }
    }


    async abort(): Promise<void> {
        if (this.session) {
            await this.sessionManager.closeSession();
            // console.log('Session aborted');
        }
    }

    getSession(): ClientSession | null {
        return this.session;
    }

    getRepository<T>(repository: IBaseRepository<T>): IBaseRepository<T> {
        const session = this.getSession();
        if (session) {
            repository.setSession(session);
        }
        return repository;
    }
}
