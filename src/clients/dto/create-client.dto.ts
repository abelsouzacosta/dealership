import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
  phone_numbers: PhoneNumber[];

  @IsArray()
  @IsNotEmpty()
  addresses: Address[];
}
