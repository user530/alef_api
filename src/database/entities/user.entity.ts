import { OneToMany } from 'typeorm';
import { Person } from './person.entity';
import { Child } from './child.entity';

export class User extends Person {
    @OneToMany(() => Child, child => child.parent)
    children: Child[];
}