import { ManyToOne } from 'typeorm';
import { Person } from './person.entity';
import { User } from './user.entity';

export class Child extends Person {
    @ManyToOne(() => User, user => user.children)
    parent: User;
}