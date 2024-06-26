import { plainToInstance } from 'class-transformer';
import { IsBooleanString, IsEnum, IsNumber, IsString, Max, Min, validateSync } from 'class-validator';

export enum DBTypes {
    pg = 'postgres',
    mysql = 'mysql',
}

class EnvironmentVariables {
    @IsEnum(DBTypes)
    DB_TYPE: DBTypes;

    @IsString()
    DB_HOST: string;

    @IsNumber()
    @Min(0)
    @Max(65535)
    DB_PORT: number;

    @IsString()
    DB_USER: string;

    @IsString()
    DB_PASS: string;

    @IsString()
    DB_NAME: string;

    @IsBooleanString()
    DB_SYNC: string;

    @IsNumber()
    @Min(0)
    @Max(65535)
    API_PORT: number;
}

export function validate(config: Record<string, unknown>) {
    const envObject = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true },
    );

    const validationErrs = validateSync(envObject, { skipMissingProperties: false });

    if (validationErrs.length !== 0)
        throw new Error(validationErrs.toString());

    return envObject;
}