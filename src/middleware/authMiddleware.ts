import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";


const SECRET_KEY  = process.env.SECRET_KEY!

interface IRequest extends Request {
    user: any
}

export const authenticateToken = async (req: IRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1]

    if(!token){
        return res.status(401).json({ error: 'Unauthorized'})
    }

    const verified = await verify(token, SECRET_KEY)

    if(!verified){
        return res.status(401).json({ error: 'Invalid Token'})
    }

    req.user = verified
    next();
}