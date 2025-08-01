import { Router } from "express";
import { container } from "../inversify.config";
import { UserController } from "../controllers/usercontroller";



const userRouter = Router();

const userController = container.resolve(UserController);
/**
* @swagger
* /users:
*   post:
*     summary: Create a new user
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               email:
*                 type: string
*               password:
*                 type: string
*     responses:
*       201:
*         description: User created successfully
*/
userRouter.post('/users', userController.createUser.bind(userController));
userRouter.get('/users', userController.getAllUsers.bind(userController));
// userRouter.put('/users/:id', (req, res) => userController.getUserByID(req, res));
userRouter.get('/users/:id', userController.getUserByID.bind(userController));
userRouter.delete('/deleteUser', userController.deleteUser.bind(userController));
userRouter.post('/updateUser', userController.updateUser.bind(userController));

/**
* @swagger
* /users:
*   get:
*     summary: Get all users
*     responses:
*       200:
*         description: A list of users
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 type: object
*                 properties:
*                   id:
*                     type: string
*                   name:
*                     type: string
*                   email:
*                     type: string
*/


export { userRouter };



//import { Router } from 'express';
//import { UserController } from '../controllers/usercontroller';

//const router = Router();
//const userController = new UserController();
///**
// * @swagger
// * /users:
// *   post:
// *     summary: Create a new user
// *     requestBody:
// *       required: true
// *       content:
// *         application/json:
// *           schema:
// *             type: object
// *             properties:
// *               name:
// *                 type: string
// *               email:
// *                 type: string
// *               password:
// *                 type: string
// *     responses:
// *       201:
// *         description: User created successfully
// */
//router.post('/users', (req, res) => userController.createUser(req, res));

///**
// * @swagger
// * /users:
// *   get:
// *     summary: Get all users
// *     responses:
// *       200:
// *         description: A list of users
// *         content:
// *           application/json:
// *             schema:
// *               type: array
// *               items:
// *                 type: object
// *                 properties:
// *                   id:
// *                     type: string
// *                   name:
// *                     type: string
// *                   email:
// *                     type: string
// */
//router.get('/users', (req, res) => userController.getAllUsers(req, res));

///**
// * @swagger
// * /users/{id}:
// *   get:
// *     summary: Get user by ID
// *     parameters:
// *       - in: path
// *         name: id
// *         required: true
// *         schema:
// *           type: string
// *     responses:
// *       200:
// *         description: A user object
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 id:
// *                   type: string
// *                 name:
// *                   type: string
// *                 email:
// *                   type: string
// */
//router.get('/users/:id', (req, res) => userController.getAllUsers(req, res));

///**
// * @swagger
// * /users/{id}:
// *   put:
// *     summary: Update user by ID
// *     parameters:
// *       - in: path
// *         name: id
// *         required: true
// *         schema:
// *           type: string
// *     requestBody:
// *       required: true
// *       content:
// *         application/json:
// *           schema:
// *             type: object
// *             properties:
// *               name:
// *                 type: string
// *               email:
// *                 type: string
// *               password:
// *                 type: string
// *     responses:
// *       200:
// *         description: User updated successfully
// */

/////**
//// * @swagger
//// * /users/{id}:
//// *   delete:
//// *     summary: Delete user by ID
//// *     parameters:
//// *       - in: path
//// *         name: id
//// *         required: true
//// *         schema:
//// *           type: string
//// *     responses:
//// *       200:
//// *         description: User deleted successfully
//// */
////router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));

//export default router;
