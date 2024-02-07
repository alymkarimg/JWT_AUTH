import bcrypt from 'bcryptjs'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../db/models/user'
import { IUserRequest } from '../middleware/authMiddleware'

const JWT_SECRET  = process.env.JWT_SECRET!


declare module 'express-session' {
    interface SessionData {
      userId?: number;
    }
  }

export class UserController {
    static async register(req: IUserRequest, res: Response) {
        const { email, password } = req.body

        try {
            const existingUser = await User.findOne({ where: { email }})
            if(existingUser){
                return res.status(400).json({ error: 'User already exists' });
            }

            // hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt)

            const user = await User.create({ email, password: hashedPassword})
            res.status(201).json({ message: 'User registered successfully', userid: user.id})
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Server error'})
        }
    }

    static async login(req: IUserRequest, res: Response) {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ where: { email }})
            if(!user){
                return res.status(400).json({ error: 'User does not exist' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if(!isPasswordValid){
                return res.status(401).json({ error: 'Invalid credentials'})
            }

            const accessToken = jwt.sign({ userId: user.id}, JWT_SECRET, { expiresIn: '15m'})

            const refreshToken = jwt.sign({ userId: user.id}, JWT_SECRET, { expiresIn: '7d'})

            req.session.userId = user.id
            req.session.save();
            res.status(200).json({ accessToken, refreshToken})
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Server error'})
        }
    }

    static async upgrade(req: IUserRequest, res: Response) {
        const { email } = req.body

        try {
            const user = await User.findOne({ where: { email }})
            if(!user){
                return res.status(400).json({ error: 'User does not exist' });
            }
            if(user.role === 'admin'){
                return res.status(400).json({ error: 'User is already admin' });
            }

            await user.update({ role: 'admin'})
            
            res.status(200).json({ message: 'user updgraded to admin'})
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Server error'})
        }
    }

    static async member(_req: IUserRequest, res: Response) {
        res.status(200).json({ message: 'welcome to scorchsoft, you member!'})
    }   

    static async admin(_req: IUserRequest, res: Response) {
        res.status(200).json({ message: 'welcome to scorchsoft, you admin!'})
    }   

    static async logout(_req: IUserRequest, res: Response) {
        res.status(200).json({ message: 'logged out!'})
    }   
}