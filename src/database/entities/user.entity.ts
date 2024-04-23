import { Entity, OneToMany } from 'typeorm';
import { Person } from './person.entity';
import { Child } from './child.entity';

@Entity({ name: 'api_user' })
export class User extends Person {
    @OneToMany(() => Child, child => child.parent)
    children: Child[];
}