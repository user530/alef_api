import { Entity, OneToMany } from 'typeorm';
import { Person, Child } from './index';

@Entity({ name: 'api_user' })
export class User extends Person {
    @OneToMany(() => Child, child => child.parent)
    children: Child[];
}