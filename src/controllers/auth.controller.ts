import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { Task } from "../entities/task.entity";

import { AppDataSource } from "../config/data-source";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepo = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await userRepo.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepo.create({
            name,
            email,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "user" // force default to "user" if not explicitly "admin"
        });

        await userRepo.save(user);

        res.status(201).json({ message: "User registered successfully", role: user.role });
    } catch (err) {
        res.status(500).json({ error: "Registration failed", details: err });
    }
};



export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await userRepo.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

        // Include role in the JWT payload
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err });
    }
};
