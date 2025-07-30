// user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;


    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column({ default: "user" })
    role!: "user" | "admin";

    @OneToMany(() => Task, (task) => task.user)
    tasks!: Task[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
