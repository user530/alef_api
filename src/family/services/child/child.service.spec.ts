import { Test, TestingModule } from '@nestjs/testing';
import { ChildService } from './child.service';
import { Repository } from 'typeorm';
import { Child, User } from '../../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('ChildService', () => {
  let service: ChildService;
  let mockUserRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let mockChildRepository: Partial<Record<keyof Repository<Child>, jest.Mock>>;

  beforeEach(async () => {
    // Implement mock repository methods
    mockUserRepository = {
      findOne: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockChildRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildService,
        {
          provide: getRepositoryToken(Child),
          useValue: mockChildRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ChildService>(ChildService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getChildrenForUser', () => {
    it('should return all children for a given user', async () => {
      // Mockup data
      const userId = 1;
      const expectedChildren = [
        {
          id: 1,
          firstName: 'Маша',
          lastName: 'Пупкина',
          fatherName: 'Васильевна',
          age: 13
        },
        {
          id: 2,
          firstName: 'Семён',
          lastName: 'Пупкин',
          fatherName: 'Васильевич',
          age: 14
        },
      ];

      // Emulate repostitory returns
      mockUserRepository.findOneBy.mockResolvedValue({ id: userId });
      mockChildRepository.find.mockResolvedValue(expectedChildren);

      // Method call result
      const result = await service.getChildrenForUser(userId);

      // Check that service returns what repository provides, and verify that it was called with right arguments
      expect(result).toEqual(expectedChildren);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
      expect(mockChildRepository.find).toHaveBeenCalledWith({ where: { parent: { id: userId } } });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);
      await expect(service.getChildrenForUser(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addChildToUser', () => {
    it('should add a child to a user', async () => {
      // Mockup data
      const createChildDto = {
        firstName: 'Пётр',
        lastName: 'Пупкин',
        fatherName: 'Васильевич',
        age: 13
      };
      const parentUser = {
        id: 1,
        firstName: 'Вася',
        lastName: 'Пупкин',
        fatherName: 'Петрович',
        age: 30,
        children: 2,
      };
      const savedChild = {
        ...createChildDto,
        id: 3,
        parent: parentUser,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      };

      // Emulate repostitory returns
      mockUserRepository.findOne.mockResolvedValue(parentUser);
      mockChildRepository.create.mockReturnValue(savedChild);
      mockChildRepository.save.mockResolvedValue(savedChild);

      // Method call result
      const result = await service.addChildToUser(parentUser.id, createChildDto);

      // Check that service returns what repository provides, and verify that it was called with right arguments
      expect(result).toEqual(savedChild);
      expect(mockUserRepository.findOne)
        .toHaveBeenCalledWith({
          where: { id: parentUser.id },
          relations: ['children'],
        });

      expect(mockChildRepository.create)
        .toHaveBeenCalledWith({
          ...createChildDto,
          parent: parentUser,
        });

      expect(mockChildRepository.save).toHaveBeenCalledWith(savedChild);
    });

    it('should throw BadRequestException if child count exceeds limit', async () => {
      const parentUser = {
        id: 1,
        firstName: 'Вася',
        lastName: 'Пупкин',
        fatherName: 'Петрович',
        age: 30,
        children: new Array(5).fill({}),
      };

      mockUserRepository.findOne.mockResolvedValue(parentUser);

      await expect(
        service
          .addChildToUser(1, {
            firstName: 'Елизавета',
            lastName: 'Пупкина',
            fatherName: 'Васильевна',
            age: 3
          }))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if child age is not suitable', async () => {
      const parentUser = {
        id: 1,
        firstName: 'Вася',
        lastName: 'Пупкин',
        fatherName: 'Петрович',
        age: 30,
        children: new Array(2).fill({}),
      };

      mockUserRepository.findOne.mockResolvedValue(parentUser);

      await expect(
        service
          .addChildToUser(1, {
            firstName: 'Евлампий',
            lastName: 'Пупкин',
            fatherName: 'ВасильевичЪ',
            age: 103
          }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('updateChild', () => {
    it('should update a child if it exists and is related to the user', async () => {
      const userId = 1;
      const updateChildDTO = { age: 4 };
      const existingChild = {
        id: 5,
        firstName: 'Елизавета',
        lastName: 'Пупкина',
        fatherName: 'Васильевна',
        age: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        parent: { id: userId }
      };

      mockChildRepository.findOne.mockResolvedValue(existingChild);
      mockChildRepository.preload.mockResolvedValue({
        ...existingChild,
        ...updateChildDTO,
        updatedAt: new Date(),
      });
      mockChildRepository.save.mockResolvedValue({
        ...existingChild,
        ...updateChildDTO,
      });

      const result = await service.updateChild(userId, existingChild.id, updateChildDTO);

      expect(result).toEqual({ ...existingChild, ...updateChildDTO });
      expect(mockChildRepository.preload)
        .toHaveBeenCalledWith({
          ...updateChildDTO,
          updatedAt: expect.any(Date),
          createdAt: existingChild.createdAt,
          id: existingChild.id
        });
    });

    it('should throw BadRequestException if updated age is not suitable', async () => {
      const parentUser = {
        id: 1,
        firstName: 'Вася',
        lastName: 'Пупкин',
        fatherName: 'Петрович',
        age: 30,
        children: new Array(2).fill({}),
      };
      const existingChild = {
        id: 5,
        firstName: 'Елизавета',
        lastName: 'Пупкина',
        fatherName: 'Васильевна',
        age: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        parent: parentUser,
      };

      mockChildRepository.findOne.mockResolvedValue(existingChild);

      await expect(
        service
          .updateChild(
            parentUser.id,
            existingChild.id,
            { age: parentUser.age + 1 }
          ))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if the child does not exist or not related to user', async () => {
      mockChildRepository.findOne.mockResolvedValue(null);

      await expect(service.updateChild(1, 99, { age: 10 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteChild', () => {
    it('should delete the child if it exists and is related to the user', async () => {
      const parentUser = {
        id: 1,
        firstName: 'Вася',
        lastName: 'Пупкин',
        fatherName: 'Петрович',
        age: 30,
        children: new Array(2).fill({}),
      };
      const existingChild = {
        id: 5,
        firstName: 'Елизавета',
        lastName: 'Пупкина',
        fatherName: 'Васильевна',
        age: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        parent: parentUser,
      };

      mockChildRepository.findOne.mockResolvedValue(existingChild);
      mockChildRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteChild(parentUser.id, existingChild.id);
      expect(mockChildRepository.delete).toHaveBeenCalledWith(existingChild.id);
    });

    it('should throw NotFoundException if the child does not exist', async () => {
      mockChildRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteChild(1, 7)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the child is not related to the user', async () => {
      const existingChild = {
        id: 5,
        firstName: 'Елизавета',
        lastName: 'Пупкина',
        fatherName: 'Васильевна',
        age: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        parent: { id: 1 },
      }; // Child belongs to another user

      mockChildRepository.findOne.mockResolvedValue(existingChild);

      await expect(service.deleteChild(2, 1)).rejects.toThrow(UnauthorizedException);
    });
  });


  describe('getChildById', () => {
    it('should return the child if it exists and is related to the user', async () => {
      const parentUser = {
        id: 1,
        firstName: 'Вася',
        lastName: 'Пупкин',
        fatherName: 'Петрович',
        age: 30,
        children: new Array(2).fill({}),
      };
      const existingChild = {
        id: 5,
        firstName: 'Елизавета',
        lastName: 'Пупкина',
        fatherName: 'Васильевна',
        age: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        parent: parentUser,
      };

      mockChildRepository.findOne.mockResolvedValue(existingChild);

      const result = await service.getChildById(parentUser.id, existingChild.id);
      expect(result).toEqual(existingChild);
      expect(mockChildRepository.findOne).toHaveBeenCalledWith({
        where: { id: existingChild.id },
        relations: ['parent']
      });
    });

    it('should throw NotFoundException if the child does not exist', async () => {
      mockChildRepository.findOne.mockResolvedValue(null);

      await expect(service.getChildById(1, 7)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if the child is not related to the user', async () => {
      const existingChild = {
        id: 5,
        firstName: 'Елизавета',
        lastName: 'Пупкина',
        fatherName: 'Васильевна',
        age: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        parent: { id: 1 },
      };

      mockChildRepository.findOne.mockResolvedValue(existingChild);

      await expect(service.getChildById(2, 5)).rejects.toThrow(UnauthorizedException);
    });
  });

});
