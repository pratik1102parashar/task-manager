import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/data-source";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        console.log("📦 Database connected asas");

        app.listen(PORT, () => {
            console.log(`🚀 asasServer running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error during Data Source initialization:", err);
    });
