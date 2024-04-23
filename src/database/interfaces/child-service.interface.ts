import { CreateChildDTO, UpdateChildDTO } from '../dtos/child';
import { Child } from '../entities';

export interface IChildService {
    getChildrenForUser(userId: number): Promise<Child[]>;
    getChildById(childId: number): Promise<Child | null>;
    addChildToUser(userId: number, createChildDTO: CreateChildDTO): Promise<Child>;
    updateChild(childId: number, updateChildDTO: UpdateChildDTO): Promise<Child>;
    deleteChild(childId: number): Promise<void>;
}