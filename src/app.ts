import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { json } from "body-parser";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { setupSwagger } from "./utils/swagger"; // If you're using Swagger

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

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Swagger (optional)
setupSwagger(app); // Uncomment if implemented

// Error handling middleware (always after routes)
app.use(errorHandler);

export default app;
