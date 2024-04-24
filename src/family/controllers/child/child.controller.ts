import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int/custom-parse-int.pipe';
import { CreateChildDTO, UpdateChildDTO } from '../../dtos';
import { Child } from '../../entities';
import { ChildService } from '../../services';

@Controller('api/v1/users/:userId/children')
export class ChildController {
    constructor(
        private readonly childService: ChildService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    getAllUserChildren(
        @Param('userId', CustomParseIntPipe) userId: number,
    ): Promise<Child[]> {
        return this.childService.getChildrenForUser(userId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    addChild(
        @Param('userId', CustomParseIntPipe) userId: number,
        @Body() createChildDto: CreateChildDTO,
    ): Promise<Child> {
        return this.childService.addChildToUser(userId, createChildDto);
    }

    @Get(':childId')
    @HttpCode(HttpStatus.OK)
    getChildById(
        @Param('userId', CustomParseIntPipe) userId: number,
        @Param('childId', CustomParseIntPipe) childId: number,
    ): Promise<Child | null> {
        return this.childService.getChildById(userId, childId);
    }

    @Patch(':childId')
    @HttpCode(HttpStatus.OK)
    updateChild(
        @Param('userId', CustomParseIntPipe) userId: number,
        @Param('childId', CustomParseIntPipe) childId: number,
        @Body() updateChildDto: UpdateChildDTO,
    ): Promise<Child> {
        return this.childService.updateChild(userId, childId, updateChildDto);
    }

    @Delete(':childId')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteChild(
        @Param('userId', CustomParseIntPipe) userId: number,
        @Param('childId', CustomParseIntPipe) childId: number,
    ): Promise<void> {
        return this.childService.deleteChild(userId, childId);
    }
}
