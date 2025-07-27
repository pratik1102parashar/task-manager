import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column({ default: false })
    completed!: boolean;

    @ManyToOne(() => User, (user) => user.tasks)
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true }) // <--- Add this line
    deletedAt?: Date;
}
