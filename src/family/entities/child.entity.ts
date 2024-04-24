import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Person, User } from './index';

@Entity()
export class Child extends Person {
    // In this implementation we separate children from users and I decided not to keep children data for deleted user
    @ManyToOne(() => User, user => user.children, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_id' })
    parent: User;
}