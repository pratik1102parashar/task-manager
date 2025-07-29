import { Router } from "express";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();



// Logging middleware (optional)
router.use((req, res, next) => {
    console.log("💡 Task route hit:", req.method, req.url);
    next();
});
router.use((req, res, next) => {
    console.log("🔐 Checking token...");
    next();
});

// 🔐 Apply authentication to all routes
router.use(authenticate);

// 👥 Authenticated users (admin or user)
router.post("/", createTask);

// ✅ Allow both users and admins to access, controller handles role filtering
router.get("/", getTasks);

// 📄 Anyone authenticated can fetch a specific task
router.get("/:id", getTaskById);

// ✏️ Anyone authenticated can update their own task
router.put("/:id", updateTask);

// ❌ Only admin can delete any task
router.delete("/:id", adminMiddleware, deleteTask);

export default router;
