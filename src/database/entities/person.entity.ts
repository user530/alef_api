import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    fatherName: string;

    @Column()
    age: number;
}