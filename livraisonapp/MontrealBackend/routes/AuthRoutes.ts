import { Router } from 'express';
import {AuthController} from '../controllers/loginController';
import { LoginRepository } from '../ServiceRepository/loginRepository'; 
import { UnitOfWork } from '../Repo/UnitOfWork';
import { container } from '../inversify.config';

const authRouter = Router();

const authController = container.resolve(AuthController);

const loginRepository = new LoginRepository();

// authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/login', authController.login.bind(authController));

export default authRouter;


