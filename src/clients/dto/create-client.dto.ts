import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PhoneNumber } from '../entities/client.entity';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  phone_numbers: PhoneNumber[];
}
