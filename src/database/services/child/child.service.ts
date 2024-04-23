import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChildDTO, UpdateChildDTO } from 'src/database/dtos/child';
import { Child, User } from 'src/database/entities';
import { IChildService } from 'src/database/interfaces/child-service.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ChildService implements IChildService {
    constructor(
        @InjectRepository(Child)
        private readonly childRepository: Repository<Child>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getChildrenForUser(userId: number): Promise<Child[]> {
        const parentUser = await this.userRepository.findOneBy({ id: userId });

        if (!parentUser)
            throw new NotFoundException('Пользователь не найден!');

        return this.childRepository.find({ where: { parent: parentUser } });
    }

    getChildById(childId: number): Promise<Child | null> {
        return this.childRepository.findOneBy({ id: childId });
    }

    async addChildToUser(userId: number, createChildDTO: CreateChildDTO): Promise<Child> {
        const parentUser = await this.userRepository.findOneBy({ id: userId });

        if (!parentUser)
            throw new NotFoundException('Пользователь не найден!');

        const newChild = this.childRepository.create(createChildDTO);
        newChild.parent = parentUser;

        return this.childRepository.save(newChild);
    }

    async updateChild(childId: number, updateChildDTO: UpdateChildDTO): Promise<Child> {
        // Try to create a new child with the id
        const updatedChild = await this.childRepository.preload({ id: childId, ...updateChildDTO });

        if (!updatedChild)
            throw new NotFoundException('Пользователь не найден!');

        return this.childRepository.save(updatedChild);
    }

    async deleteChild(childId: number): Promise<void> {
        const result = await this.childRepository.delete(childId);

        if (result.affected === 0)
            throw new NotFoundException('Пользователь не найден!');

        return;
    }
}
