import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { json } from "body-parser";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middlewares/error.middleware";


const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(json());

// Log every incoming request
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check endpoint
app.get("/health", (_, res) => {
    res.status(200).json({ status: "OK" });
});

// Error handling middleware
app.use(errorHandler);


export default app;
