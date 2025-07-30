import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";

// Extend Request to include authenticated user
interface AuthRequest extends Request {
    user?: Partial<User>;
}

const taskRepo = AppDataSource.getRepository(Task);

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description } = req.body;

        const task = taskRepo.create({
            title,
            description,
            user: { id: req.user!.id }, // Set user relationship
        });

        const savedTask = await taskRepo.save(task);
        return res.status(201).json(savedTask);
    } catch (err) {
        console.error("Error creating task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        console.log("Authenticated user:", req.user); // 👈 Add this

        const qb = taskRepo
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.user", "user")
            .where("task.isDeleted = false");

        if (req.user?.role !== "admin") {
            qb.andWhere("user.id = :userId", { userId: req.user?.id });
        }

        const tasks = await qb.orderBy("task.createdAt", "DESC").getMany();

        return res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};






// Get task by ID
export const getTaskById = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const whereClause = req.user?.role === "admin"
            ? { id: parseInt(id), isDeleted: false }
            : { id: parseInt(id), user: { id: req.user!.id }, isDeleted: false };

        const task = await taskRepo.findOne({ where: whereClause });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json(task);
    } catch (err) {
        console.error("Error fetching task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Update task
export const updateTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const whereClause = req.user?.role === "admin"
            ? { id: parseInt(id), isDeleted: false }
            : { id: parseInt(id), user: { id: req.user!.id }, isDeleted: false };

        const task = await taskRepo.findOne({ where: whereClause });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        taskRepo.merge(task, req.body);
        const updatedTask = await taskRepo.save(task);

        return res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Soft delete task
export const deleteTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const whereClause = req.user?.role === "admin"
            ? { id: parseInt(id), isDeleted: false }
            : { id: parseInt(id), user: { id: req.user!.id }, isDeleted: false };

        const task = await taskRepo.findOne({ where: whereClause });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.isDeleted = true;
        await taskRepo.save(task);

        return res.json({ message: "Task soft-deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

// Restore soft-deleted task (admin and owner only)
export const restoreTask = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    try {
        const whereClause = req.user?.role === "admin"
            ? { id: parseInt(id), isDeleted: true }
            : { id: parseInt(id), user: { id: req.user!.id }, isDeleted: true };

        const task = await taskRepo.findOne({ where: whereClause });

        if (!task) {
            return res.status(404).json({ message: "Task not found or not deleted" });
        }

        task.isDeleted = false;
        await taskRepo.save(task);

        return res.json({ message: "Task restored successfully" });
    } catch (err) {
        console.error("Error restoring task:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};
