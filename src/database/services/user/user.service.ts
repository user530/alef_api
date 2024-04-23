import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, UpdateUserDTO } from 'src/database/dtos/user';
import { User } from 'src/database/entities';
import { IUserService } from 'src/database/interfaces/user-service.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    getUserById(userId: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id: userId });
    }

    addUser(createUserDto: CreateUserDTO): Promise<User> {
        const newUser = this.userRepository.create(createUserDto);

        return this.userRepository.save(newUser);
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDTO): Promise<User> {
        // Try to create a new user with the id
        const userToUpdate = await this.userRepository.preload({ id: userId, ...updateUserDto });

        if (!userToUpdate)
            throw new NotFoundException('Пользователь не найден!');

        return this.userRepository.save(userToUpdate);
    }

    async deleteUser(userId: number): Promise<void> {
        const result = await this.userRepository.delete(userId);

        if (result.affected === 0)
            throw new NotFoundException('Пользователь не найден!');

        return;
    }
}
