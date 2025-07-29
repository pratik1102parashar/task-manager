import "reflect-metadata";
import { DataSource } from "typeorm";
import entities from "../entities";
import dotenv from "dotenv";
dotenv.config();
// Resolve DB host dynamically
// const isDev = process.env.NODE_ENV === "development";
// const host = isDev ? "localhost" : process.env.DB_HOST || "db";

const host = process.env.DB_HOST || "localhost";


console.log("DB config:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    db: process.env.DB_NAME
});

export const AppDataSource = new DataSource({
    type: "mysql",
    host,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: entities,
    migrations: [],
    subscribers: [],
});
