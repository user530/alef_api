import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from 'config/env.config';
import dbConfig from 'config/db.config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { UserController, ChildController } from 'src/app/controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
      load: [dbConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<TypeOrmModuleAsyncOptions>('database'),
    }),
    DatabaseModule,
  ],
  controllers: [
    UserController,
    ChildController,
  ],
})
export class AppModule { }
