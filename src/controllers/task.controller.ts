import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";
import { IsNull } from "typeorm";

interface AuthRequest extends Request {
    user?: Partial<User>;
}

const taskRepo = AppDataSource.getRepository(Task);
const userRepo = AppDataSource.getRepository(User);

export const createTask = async (req: AuthRequest, res: Response) => {
    console.log("Hit create task route");

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const { title } = req.body;
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: "Title is required and must be a non-empty string." });
        }

        const user = await userRepo.findOne({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const task = taskRepo.create({ title: title.trim(), user });
        const savedTask = await taskRepo.save(task);

        return res.status(201).json(savedTask);
    } catch (err) {
        console.error("Failed to create task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const tasks = await taskRepo.find({
            where: { user: { id: req.user.id }, deletedAt: IsNull() },
            order: { createdAt: "DESC" },
        });
        return res.json(tasks);
    } catch (err) {
        console.error("Failed to fetch tasks:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
export const getTaskById = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const { id } = req.params;

        const task = await taskRepo.findOne({
            where: { id: parseInt(id), user: { id: req.user.id }, deletedAt: IsNull() },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json(task);
    } catch (err) {
        console.error("Failed to fetch task by ID:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const updateTask = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const { id } = req.params;
        const { title, completed } = req.body;

        const task = await taskRepo.findOne({
            where: { id: parseInt(id), user: { id: req.user.id }, deletedAt: IsNull() },
        });
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({ message: "Title must be a non-empty string when provided." });
            }
            task.title = title.trim();
        }

        if (completed !== undefined) {
            if (typeof completed !== "boolean") {
                return res.status(400).json({ message: "Completed must be a boolean when provided." });
            }
            task.completed = completed;
        }

        const updatedTask = await taskRepo.save(task);
        return res.json(updatedTask);
    } catch (err) {
        console.error("Failed to update task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    try {
        const { id } = req.params;

        const task = await taskRepo.findOne({
            where: { id: parseInt(id), user: { id: req.user.id }, deletedAt: IsNull() },
        });
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.deletedAt = new Date();
        await taskRepo.save(task);

        return res.status(204).send(); // No Content on success
    } catch (err) {
        console.error("Failed to delete task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
