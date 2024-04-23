import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Child } from './entities';
import { UserService } from './services/user/user.service';
import { ChildService } from './services/child/child.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                User,
                Child,
            ]
        ),
    ],
    providers: [
        UserService,
        ChildService
    ],
    exports: [
        UserService,
        ChildService,
    ]
})
export class DatabaseModule { }
