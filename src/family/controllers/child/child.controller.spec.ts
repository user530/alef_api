import { Test, TestingModule } from '@nestjs/testing';
import { ChildController } from './child.controller';
import { ChildService } from '../../services';
import { AuthenticatedUserGuard, AuthorizedUserGuard } from '../../../common/guards';

describe('ChildController', () => {
  let controller: ChildController;
  let mockChildService: Partial<Record<keyof ChildService, jest.Mock>>;

  beforeEach(async () => {
    // Mock service functionality
    mockChildService = {
      getChildrenForUser: jest.fn(),
      getChildById: jest.fn(),
      addChildToUser: jest.fn(),
      updateChild: jest.fn(),
      deleteChild: jest.fn(),
    };

    // Module with emulated service
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildController],
      providers: [
        {
          provide: ChildService,
          useValue: mockChildService,
        }
      ]
    })
      // Override guards
      .overrideGuard(AuthenticatedUserGuard)
      .useValue({ canActivate: () => false })
      .overrideGuard(AuthorizedUserGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ChildController>(ChildController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUserChildren', () => {
    it('should return all children for a specified user', async () => {
      const userId = 1;
      const expectedChildren = [
        { id: 1, firstName: 'Саша', lastName: 'Пупкина', fatherName: 'Петровна', age: 7, parent: { id: userId } },
        { id: 2, firstName: 'Маша', lastName: 'Пупкина', fatherName: 'Петровна', age: 8, parent: { id: userId } },
      ];
      mockChildService.getChildrenForUser.mockResolvedValue(expectedChildren);

      const result = await controller.getAllUserChildren(userId);

      expect(result).toEqual(expectedChildren);
      expect(mockChildService.getChildrenForUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('addChild', () => {
    it('should add a child to a specified user', async () => {
      const userId = 1;
      const createChildDto = { firstName: 'Даша', lastName: 'Пупкина', fatherName: 'Петровна', age: 6 };
      const expectedChild = { ...createChildDto, id: 3, parent: { id: userId } };
      mockChildService.addChildToUser.mockResolvedValue(expectedChild);

      const result = await controller.addChild(userId, createChildDto);

      expect(result).toEqual(expectedChild);
      expect(mockChildService.addChildToUser).toHaveBeenCalledWith(userId, createChildDto);
    });
  });

  describe('getChildById', () => {
    it('should return a child by ID for a specified user', async () => {
      const userId = 1;
      const childId = 3;
      const expectedChild = {
        id: 3,
        firstName: 'Даша',
        lastName: 'Пупкина',
        fatherName: 'Петровна',
        age: 6,
        parent: { id: userId }
      };
      mockChildService.getChildById.mockResolvedValue(expectedChild);

      const result = await controller.getChildById(userId, childId);

      expect(result).toEqual(expectedChild);
      expect(mockChildService.getChildById).toHaveBeenCalledWith(userId, childId);
    });
  });

  describe('updateChild', () => {
    it('should update a child for a specified user', async () => {
      const userId = 1;
      const childId = 3;
      const updateChildDto = { age: 7 };
      const updatedChild = {
        id: childId, firstName: 'Даша',
        lastName: 'Пупкина',
        fatherName: 'Петровна',
        age: 7,
        parent: { id: userId }
      };
      mockChildService.updateChild.mockResolvedValue(updatedChild);

      const result = await controller.updateChild(userId, childId, updateChildDto);

      expect(result).toEqual(updatedChild);
      expect(mockChildService.updateChild).toHaveBeenCalledWith(userId, childId, updateChildDto);
    });
  });

  describe('deleteChild', () => {
    it('should delete a child for a specified user', async () => {
      const userId = 1;
      const childId = 2;
      mockChildService.deleteChild.mockResolvedValue(undefined);

      await controller.deleteChild(userId, childId);

      expect(mockChildService.deleteChild).toHaveBeenCalledWith(userId, childId);
    });
  });

});
