import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({
    message: 'City must be provided for the client address',
  })
  @MinLength(2, {
    message: 'City is too short',
  })
  @MaxLength(100, {
    message: 'City is too long',
  })
  city: string;

  @IsString()
  @IsNotEmpty({
    message: 'State must be provided',
  })
  @MinLength(3, {
    message: 'State is too short',
  })
  @MaxLength(20, {
    message: 'State is too long',
  })
  state: string;

  @IsString()
  @IsNotEmpty({
    message: 'District must be provided for the client address',
  })
  @MinLength(3, {
    message: 'District is too short',
  })
  @MaxLength(20, {
    message: 'District is too long',
  })
  district: string;

  @IsString()
  @IsNotEmpty({
    message: 'Street must be provided for the client address',
  })
  street: string;

  @IsNumber()
  @Min(1, {
    message: 'Number must be between 1 and 10000',
  })
  @Max(10000, {
    message: 'Number must be between 1 and 10000',
  })
  number: number;

  @IsString()
  @IsNotEmpty({
    message: 'Zipcode must be provided for the client address',
  })
  @MinLength(4, {
    message: 'Zipcode is too short',
  })
  @MaxLength(8, {
    message: 'Zipcode is too long',
  })
  zipcode: string;
}
