import { User } from '../entities';
import { CreateUserDTO, UpdateUserDTO } from '../dtos';

export interface IUserService {
    getAllUsers(): Promise<User[]>;
    getUserById(userId: number): Promise<User>;
    addUser(createUserDto: CreateUserDTO): Promise<User>;
    updateUser(userId: number, updateUserDto: UpdateUserDTO): Promise<User>;
    deleteUser(userId: number): Promise<void>;
}