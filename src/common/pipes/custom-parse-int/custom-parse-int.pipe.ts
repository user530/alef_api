import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const valueParsed = parseInt(value, 10);

    if (isNaN(valueParsed))
      throw new BadRequestException(`Значение параметра (${value}) для ${metadata.data} должно быть корректным целым числом!`);

    return valueParsed;
  }
}
