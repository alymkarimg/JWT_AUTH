import express from 'express';
import { UserController } from '../controllers/userController';
import { loginValidator, registerValidator } from '../validators/userValidator';
export const userRoutes = express.Router();

userRoutes.post('/register', registerValidator, UserController.register)
userRoutes.post('/login', loginValidator, UserController.login)