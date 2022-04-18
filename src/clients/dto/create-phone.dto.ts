import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { PhoneNumberType } from '../entities/client.entity';

export class CreatePhoneDto {
  @IsString()
  @IsEnum(PhoneNumberType)
  type: string;

  @IsString()
  @MinLength(10, {
    message: 'Phone Number is too short',
  })
  @MaxLength(15, {
    message: 'Phone Number is too long',
  })
  number: string;
}
