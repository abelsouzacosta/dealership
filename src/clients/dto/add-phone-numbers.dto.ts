import { IsArray, IsNotEmpty } from 'class-validator';
import { PhoneNumber } from '../entities/client.entity';

export class AddPhoneNumbersDto {
  @IsArray()
  @IsNotEmpty()
  phone_numbers: PhoneNumber[];
}
