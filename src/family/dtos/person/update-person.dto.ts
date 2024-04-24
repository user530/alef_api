import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonDTO } from './create-person.dto';

export class UpdatePersonDTO extends PartialType(CreatePersonDTO) { } 