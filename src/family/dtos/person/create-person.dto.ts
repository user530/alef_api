import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

// Cant make it abstrace because of the 'mapped types' partial type function
export class CreatePersonDTO {
    @IsNotEmpty({ message: 'Укажите имя (firstName)!' })
    @IsString({ message: 'Имя (firstName) должно быть строкой!' })
    firstName: string;

    @IsNotEmpty({ message: 'Укажите фамилию (lastName)!' })
    @IsString({ message: 'Фамилия (lastName) должна быть строкой!' })
    lastName: string;

    @IsNotEmpty({ message: 'Укажите отчество (fatherName)!' })
    @IsString({ message: 'Отчество (fatherName) должно быть строкой!' })
    fatherName: string;

    @IsNotEmpty({ message: 'Укажите возраст (age)!' })
    @IsInt({ message: 'Возраст (age) должен быть корректной целой цифрой!' })
    @Min(0, { message: 'Возраст (age) не может быть меньше 0!' })
    @Max(120, { message: 'Возраст (age) не может быть больше 120!' })
    age: number;
}