import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";


dotenv.config();



const app = express();
const PORT = process.env.PORT || 5000;
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("📦 Dataasdasbase connected");
        app.listen(PORT, () => {
            console.log(`🚀 Server started on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.error("❌ DB connection error:", error));
