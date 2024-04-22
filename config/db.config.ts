import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DBTypes } from './env.config';

export default registerAs('database', (): TypeOrmModuleOptions => {
    return {
        type: process.env.DB_TYPE as DBTypes,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        synchronize: process.env.DB_SYNC === 'true',
        entities: [],
        // migrations: [],
        // migrationsRun: true,
    }
})