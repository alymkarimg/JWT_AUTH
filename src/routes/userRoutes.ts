import express from 'express';
import { UserController } from '../controllers/userController';
import { isAuth, isMember, removeAuthSession, requireSignin } from '../middleware/authMiddleware';
import { loginValidator, registerValidator } from '../validators/userValidator';
export const userRoutes = express.Router();

userRoutes.post('/register', registerValidator, UserController.register)
userRoutes.post('/login', loginValidator, UserController.login)
userRoutes.get('/admin', requireSignin, isAuth, UserController.admin)
userRoutes.get('/member', requireSignin, isMember, UserController.member)
userRoutes.post('/upgrade', UserController.upgrade)
userRoutes.get('/logout', removeAuthSession, UserController.logout)