import { Child } from '../entities';
import { CreateChildDTO, UpdateChildDTO } from '../dtos';

export interface IChildService {
    getChildrenForUser(userId: number): Promise<Child[]>;
    addChildToUser(userId: number, createChildDTO: CreateChildDTO): Promise<Child>;
    getChildById(userId: number, childId: number): Promise<Child>;
    updateChild(userId: number, childId: number, updateChildDTO: UpdateChildDTO): Promise<Child>;
    deleteChild(userId: number, childId: number): Promise<void>;
}