import "reflect-metadata";
import { DataSource } from "typeorm";
import entities from "../entities";



export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root", // change if different
    password: "Pratik@25", // use your real password here
    database: "task_manager_db",
    synchronize: true,
    logging: false,
    entities: entities,
    migrations: [],
    subscribers: [],

});
