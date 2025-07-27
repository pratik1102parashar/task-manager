import { Router } from "express";
import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

console.log("🛣️ task.routes.ts is loaded");

const router = Router();


router.get("/test", (req, res) => {
    console.log("🚀 Test route hit");
    res.json({ message: "Task test working" });
});
// ✅ Logging middlewares
router.use((req, res, next) => {
    console.log("💡 Task route hit:", req.method, req.url);
    next();
});
router.use((req, res, next) => {
    console.log("🔐 Checking token...");
    next();
});
// Protect all routes with auth middleware if needed
router.use(authenticate);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
