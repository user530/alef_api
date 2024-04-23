import { CreateUserDTO, UpdateUserDTO } from '../dtos/user';
import { User } from '../entities';

export interface IUserService {
    getAllUsers(): Promise<User[]>;
    getUserById(userId: number): Promise<User | null>;
    addUser(createUserDto: CreateUserDTO): Promise<User>;
    updateUser(userId: number, updateUserDto: UpdateUserDTO): Promise<User>;
    deleteUser(userId: number): Promise<void>;
}