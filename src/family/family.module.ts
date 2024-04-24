import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child, User } from './entities';
import { ChildController, UserController } from './controllers';
import { ChildService, UserService } from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                User,
                Child,
            ]
        ),
    ],
    controllers: [
        UserController,
        ChildController,
    ],
    providers: [
        UserService,
        ChildService,
    ]
})
export class FamilyModule { }
