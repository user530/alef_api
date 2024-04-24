import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CustomParseIntPipe } from 'src/common/pipes';
import { AuthenticatedUserGuard, AuthorizedUserGuard } from 'src/common/guards';
import { CreateUserDTO, UpdateUserDTO } from '../../dtos';
import { User } from '../../entities';
import { UserService } from '../../services';

@Controller('api/v1/users')
@UseGuards(AuthenticatedUserGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Get(':userId')
    @UseGuards(AuthorizedUserGuard)
    @HttpCode(HttpStatus.OK)
    getUserById(
        @Param('userId', CustomParseIntPipe) userId: number,
    ): Promise<User | null> {
        return this.userService.getUserById(userId);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    addUser(
        @Body() createUserDto: CreateUserDTO,
    ): Promise<User> {
        return this.userService.addUser(createUserDto);
    }

    @Patch(':userId')
    @UseGuards(AuthorizedUserGuard)
    @HttpCode(HttpStatus.OK)
    updateUser(
        @Param('userId', CustomParseIntPipe) userId: number,
        @Body() updateUserDto: UpdateUserDTO,
    ): Promise<User> {
        return this.userService.updateUser(userId, updateUserDto);
    }

    @Delete(':userId')
    @UseGuards(AuthorizedUserGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(
        @Param('userId', CustomParseIntPipe) userId: number,
    ): Promise<void> {
        return this.userService.deleteUser(userId);
    }
}
