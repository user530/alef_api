import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IChildService } from '../../interfaces';
import { Child, User } from '../../entities';
import { CreateChildDTO, UpdateChildDTO } from '../../dtos';

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

        return this.childRepository.find({ where: { parent: { id: userId } } });
    }

    getChildById(userId: number, childId: number): Promise<Child> {
        // Find child and check that it exists and is related to the user
        return this.findChildWithChecks(userId, childId);
    }

    async addChildToUser(userId: number, createChildDTO: CreateChildDTO): Promise<Child> {
        const parentUser = await this.userRepository.findOne(
            {
                where: { id: userId },
                relations: ['children'],
            });

        if (!parentUser)
            throw new NotFoundException('Пользователь не найден!');

        if (parentUser.children.length >= 5)
            throw new BadRequestException('Пользователь уже имеет 5 детей!');

        if (createChildDTO.age && createChildDTO.age >= parentUser.age)
            throw new BadRequestException('Возраст ребёнка не соответствует возрасту родителя!');

        const newChild = this.childRepository.create(
            {
                ...createChildDTO,
                parent: parentUser,
            });

        return this.childRepository.save(newChild);
    }

    async updateChild(userId: number, childId: number, updateChildDTO: UpdateChildDTO): Promise<Child> {
        // Find child and check that it exists and is related to the user
        const existingChild = await this.findChildWithChecks(userId, childId);

        if (updateChildDTO.age && updateChildDTO.age >= existingChild.parent.age)
            throw new BadRequestException('Возраст ребёнка не соответствует возрасту родителя!');

        // Copy data and partially update from dto, safeguarding protected fields
        const updatedChild = await this.childRepository.preload(
            {
                ...updateChildDTO,
                updatedAt: new Date(),
                createdAt: existingChild.createdAt,
                id: childId
            });

        return this.childRepository.save(updatedChild);
    }

    async deleteChild(userId: number, childId: number): Promise<void> {
        // Find child and check that it exists and is related to the user
        await this.findChildWithChecks(userId, childId);

        await this.childRepository.delete(childId);

        return;
    }

    private async findChildWithChecks(userId: number, childId: number): Promise<Child> {
        const existingChild = await this.childRepository.findOne(
            {
                where: { id: childId },
                relations: ['parent'],
            });

        if (!existingChild)
            throw new NotFoundException('Ребёнок не найден!');

        if (existingChild.parent.id !== userId)
            throw new UnauthorizedException('Отказано в доступе!');

        return existingChild;
    }
}
