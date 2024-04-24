import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    // Implement mock repository methods
    mockUserRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      preload: jest.fn(),
      delete: jest.fn(),
    }

    // Testing module with mock repository
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const testUsers = [
        {
          id: 1,
          firstName: 'Вася',
          lastName: 'Пупкин',
          fatherName: 'Петрович',
          age: 30
        },
        {
          id: 2,
          firstName: 'Марья',
          lastName: 'Гавриловна',
          fatherName: 'Харитонова',
          age: 24
        },
        {
          id: 3,
          firstName: 'Василий',
          lastName: 'Алибабаевич',
          fatherName: 'Можно просто Вася',
          age: 41
        }
      ];

      // Emulate repostitory return
      mockUserRepository.find.mockResolvedValue(testUsers);

      // Method call result 
      const result = await service.getAllUsers();

      // Check that service returns what repository provides, and verify that it was called
      expect(result).toEqual(testUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should retrieve and return a single user', async () => {
      const testUser = {
        id: 1,
        firstName: 'Вася',
        lastName: 'Пупкин',
        fatherName: 'Петрович',
        age: 30
      };
      // Emulate repostitory return
      mockUserRepository.findOneBy.mockResolvedValue(testUser);

      // Method call result
      const result = await service.getUserById(1);

      // Check that service returns data found, and verify that it was called correctly
      expect(result).toEqual(testUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if the user is not found', async () => {
      // Emulate empty return from the DB
      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Ensure it throws correctly
      await expect(service.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addUser', () => {
    it('should create and save a new user', async () => {
      // Mock dto and user entity
      const createUserDto = { firstName: 'Иван', lastName: 'Иванов', fatherName: 'Иванович', age: 30 };
      const newUser = { ...createUserDto, id: 1 };

      // Emulate repository response
      mockUserRepository.create.mockReturnValue(newUser);
      mockUserRepository.save.mockReturnValue(newUser);

      // Method call result
      const result = await service.addUser(createUserDto);

      // Check result and call arguments
      expect(result).toEqual(newUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      // Mock dto and entities
      const updateUserDto = { firstName: 'Василий', lastName: 'Алибабаевич', age: 32 };
      const currentUser = {
        firstName: 'Иван',
        lastName: 'Иванов',
        fatherName: 'Иванович',
        age: 30,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      };
      const updatedUser = { ...currentUser, updateUserDto, updateAt: new Date() };

      // Emulate repository calls
      mockUserRepository.findOneBy.mockResolvedValue(currentUser);
      mockUserRepository.preload.mockResolvedValue(updatedUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Method call result
      const result = await service.updateUser(1, updateUserDto);

      // Check result and call arguments
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockUserRepository.preload).toHaveBeenCalledWith(
        {
          ...updateUserDto,
          id: 1,
          createdAt: currentUser.createdAt,
          updatedAt: expect.any(Date),
        }
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      // Emulate empty return from the DB
      mockUserRepository.findOneBy.mockResolvedValue(undefined);
      // Check for the error
      await expect(service.updateUser(1, { lastName: 'Пупкин' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      // Emulate successfull deletion
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteUser(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if no user is found to delete', async () => {
      // Emulate failed deletion
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteUser(1)).rejects.toThrow(NotFoundException);
    });
  });

});
