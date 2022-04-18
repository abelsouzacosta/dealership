import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Client, PhoneNumberType } from '../entities/client.entity';
import { CreateAddressDto } from '../dto/create-address.dto';

@Injectable()
export class CreateClientValidationPipe implements PipeTransform {
  private isEmpty(value: any): boolean {
    if (Object.keys(value).length < 1) {
      return true;
    }

    return false;
  }

  private formatErrors(errors: any[]) {
    return errors
      .map((error) => {
        for (const key in error.constraints) {
          return error.constraints[key];
        }
      })
      .join(' - ');
  }

  async transform(value: Client, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    const { phone_numbers, addresses } = value;
    const phoneNumberTypeKeys = Object.keys(PhoneNumberType);

    for (const phone_number of phone_numbers) {
      if (!phoneNumberTypeKeys.includes(phone_number.type)) {
        throw new HttpException(
          `Invalid Phone type for number ${phone_number.number}, phone type must match enum: ${PhoneNumberType.Comercial}, ${PhoneNumberType.Residencial}, ${PhoneNumberType.Pessoal}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    for (const address of addresses) {
      const object = plainToClass(CreateAddressDto, address);
      const errors = await validate(object);

      if (errors.length > 0)
        throw new BadRequestException(
          `Validation failed: ${this.formatErrors(errors)}`,
        );
    }

    if (this.isEmpty(value))
      throw new HttpException(
        `Validation failed to payload provided`,
        HttpStatus.BAD_REQUEST,
      );

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0)
      throw new HttpException(
        `Validation failed: ${this.formatErrors(errors)}`,
        HttpStatus.BAD_REQUEST,
      );

    return value;
  }
}
