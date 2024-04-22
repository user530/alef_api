import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from 'config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
