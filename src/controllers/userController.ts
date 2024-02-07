import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../db/models/user'

const SECRET_KEY  = process.env.SECRET_KEY!

export class UserController {
    static async register(req: Request, res: Response) {
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

    static async login(req: Request, res: Response) {
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

            const accessToken = jwt.sign({ userId: user.id}, SECRET_KEY, { expiresIn: '15m'})

            const refreshToken = jwt.sign({ userId: user.id}, SECRET_KEY, { expiresIn: '7d'})

            res.status(200).json({ accessToken, refreshToken})
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: 'Server error'})
        }
    }
}