import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Address, PhoneNumber } from '../entities/client.entity';

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
  @ArrayMaxSize(3) // TODO: remove phone number array max size
  phone_numbers: PhoneNumber[];

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  addresses: Address[];
}
