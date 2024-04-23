import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreatePersonDTO {
    @IsNotEmpty({ message: 'Укажите имя!' })
    @IsString({ message: 'Имя должно быть строкой!' })
    firstName: string;

    @IsNotEmpty({ message: 'Укажите фамилию!' })
    @IsString({ message: 'Фамилия должна быть строкой!' })
    lastName: string;

    @IsNotEmpty({ message: 'Укажите отчество!' })
    @IsString({ message: 'Отчество должно быть строкой!' })
    fatherName: string;

    @IsNotEmpty({ message: 'Укажите возраст!' })
    @IsInt({ message: 'Возраст должен быть корректной целой цифрой!' })
    @Min(0, { message: 'Возраст не может быть меньше 0!' })
    @Max(120, { message: 'Возраст не может быть больше 120!' })
    age: number;
}