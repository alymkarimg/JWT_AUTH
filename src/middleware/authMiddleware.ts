import type { NextFunction, Request, Response } from "express";
import { TokenGetter, expressjwt } from "express-jwt";
import User from "../db/models/user";

export interface IUserRequest extends Request {
    userId?: number
    auth?: { userId: number }
}


const getToken: TokenGetter = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    else {
        return undefined
    }
}

export const requireSignin =  expressjwt({
    secret: process.env.JWT_SECRET!,
    algorithms: ["HS256"],
    getToken,
    requestProperty: 'auth'
})

export const isMember =  async (req: IUserRequest, res: Response, next: NextFunction) => {
   
    let isSameUser = req.session.userId && req.auth && req.session.userId == req.auth.userId
    if (!isSameUser) {
        return res.status(403).json({
            error: 'Access denied.'
        })
    }
    next()
}

export const isAuth =  async (req: IUserRequest, res: Response, next: NextFunction) => {
   
    let isSameUser = req.session.userId && req.auth && req.session.userId == req.auth.userId
    if (!isSameUser) {
        return res.status(403).json({
            error: 'Access denied.'
        })
    }

    const user = await User.findOne({ where: { id: req.auth?.userId}})

    if(user!.role === 'admin'){
        next();
    } else 
    {
        return res.status(403).json({
            error: 'Must be admin to view this route.'
        })
    }
}

export const removeAuthSession =  async (req: IUserRequest, res: Response, next: NextFunction) => {
    
    req.session.userId = undefined
    req.auth = undefined
    next()
}
