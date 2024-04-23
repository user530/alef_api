import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CustomParseIntPipe } from 'src/common/pipes/custom-parse-int/custom-parse-int.pipe';
import { CreateChildDTO, UpdateChildDTO } from 'src/database/dtos/child';
import { Child } from 'src/database/entities';
import { ChildService } from 'src/database/services/child/child.service';

@Controller('api/v1/users/:userId/children')
export class ChildController {
    constructor(
        private readonly childService: ChildService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    getAllUserChildren(
        @Param('userId', CustomParseIntPipe) userId: number
    ): Promise<Child[]> {
        return this.childService.getChildrenForUser(userId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    addChild(
        @Param('userId', CustomParseIntPipe) userId: number,
        @Body() createChildDto: CreateChildDTO
    ): Promise<Child> {
        return this.childService.addChildToUser(userId, createChildDto);
    }

    @Patch(':childId')
    @HttpCode(HttpStatus.OK)
    updateChild(
        @Param('childId', CustomParseIntPipe) childId: number,
        @Body() updateChildDto: UpdateChildDTO
    ): Promise<Child> {
        return this.childService.updateChild(childId, updateChildDto);
    }

    @Delete(':childId')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteChild(@Param('childId', CustomParseIntPipe) childId: number
    ): Promise<void> {
        return this.childService.deleteChild(childId);
    }
}
