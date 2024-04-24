import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services';
import { AuthenticatedUserGuard, AuthorizedUserGuard } from '../../../common/guards';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    // Mock service functionality
    mockUserService = {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      addUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    // Load module with mock service
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        }
      ]
    })
      // Overwrite guards
      .overrideGuard(AuthenticatedUserGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AuthorizedUserGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Prepare data and mock service return
      const expectedUsers = [{ id: 1, firstName: 'Вася', lastName: 'Пупкин', fatherName: 'Петрович', age: 30 }];
      mockUserService.getAllUsers.mockResolvedValue(expectedUsers);

      // Emulate controller call
      const result = await controller.getAllUsers();

      // Check endpoint result and call arguments
      expect(result).toEqual(expectedUsers);
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const expectedUser = { id: 1, firstName: 'Вася', lastName: 'Пупкин', fatherName: 'Петрович', age: 30 };
      mockUserService.getUserById.mockResolvedValue(expectedUser);

      const result = await controller.getUserById(expectedUser.id);
      expect(result).toEqual(expectedUser);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(expectedUser.id);
    });
  });

  describe('addUser', () => {
    it('should add a new user and return that user', async () => {
      const createUserDto = { firstName: 'Иван', lastName: 'Иванов', fatherName: 'Иванович', age: 20 };
      const expectedUser = { id: 2, firstName: 'Иван', lastName: 'Иванов', fatherName: 'Иванович', age: 20 };
      mockUserService.addUser.mockResolvedValue(expectedUser);

      const result = await controller.addUser(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUserService.addUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update the user and return the updated user', async () => {
      const user = { id: 1, firstName: 'Вася', lastName: 'Пупкин', fatherName: 'Петрович', age: 30 };
      const updateUserDto = { age: 20 };
      const updatedUser = { ...user, ...updateUserDto };
      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(user.id, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(user.id, updateUserDto);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      const userId = 1;
      mockUserService.deleteUser.mockResolvedValue(undefined);

      await controller.deleteUser(userId);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });

});
