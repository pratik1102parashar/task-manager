import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/user.entity";

import dotenv from "dotenv";
dotenv.config();


interface AuthRequest extends Request {
    user?: Partial<User>;
}

if (!process.env.JWT_SECRET) {
    throw new Error("❌ JWT_SECRET not set in environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    console.log("🧾 Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("❌ No Bearer token provided");
        return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        console.log("✅ Token verified. Payload:", decoded);

        // Safely attach user
        req.user = { id: decoded.userId }; // Only attach what you need
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
