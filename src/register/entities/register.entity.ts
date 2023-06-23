import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Register {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({default: true})
    isActivated: boolean;

    @Column({default: false})
    isVerified: boolean;

    @CreateDateColumn({nullable: true})
    createdAt: Date;

    @Column({nullable: true})
    crratedBy: string;

    @UpdateDateColumn({nullable: true})
    updatedAt: Date;

    @Column({nullable: true})
    updatedBy: string;

    @DeleteDateColumn({nullable: true})
    deletedAt: Date;

    @Column({nullable: true})
    deletedBy: string;

    @Column({nullable: true})
    token: string;

    @Column({default: 0})
    count: number;

    // @Column({default: null})
    // time: string;
}
