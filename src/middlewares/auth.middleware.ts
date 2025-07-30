// auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";

import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
    user?: Partial<User>; //  Exported now
}

if (!process.env.JWT_SECRET) {
    throw new Error(" JWT_SECRET not set in environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        req.user = {
            id: decoded.userId,
            role: decoded.role
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
