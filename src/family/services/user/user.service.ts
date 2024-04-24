import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserService } from '../../interfaces';
import { User } from '../../entities';
import { CreateUserDTO, UpdateUserDTO } from '../../dtos';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    getUserById(userId: number): Promise<User> {
        return this.getUserWithChecks(userId);
    }

    addUser(createUserDto: CreateUserDTO): Promise<User> {
        const newUser = this.userRepository.create(createUserDto);

        return this.userRepository.save(newUser);
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDTO): Promise<User> {
        // Find user and check that it exists
        const existingUser = await this.getUserWithChecks(userId);

        // Create updated user from the dto and safeguard protected fields
        const updatedUser = await this.userRepository.preload(
            {
                ...updateUserDto,
                updatedAt: new Date(),
                createdAt: existingUser.createdAt,
                id: userId
            });

        return this.userRepository.save(updatedUser);
    }

    async deleteUser(userId: number): Promise<void> {
        const result = await this.userRepository.delete(userId);

        if (result.affected === 0)
            throw new NotFoundException('Пользователь не найден!');

        return;
    }

    private async getUserWithChecks(userId: number): Promise<User> {
        const existingUser = await this.userRepository.findOneBy({ id: userId });

        if (!existingUser)
            throw new NotFoundException('Пользователь не найден!');

        return existingUser;
    }
}
