import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  fabrication_year: number;

  @IsNumber()
  model_year: number;

  @IsString()
  @IsNotEmpty()
  license_plate: string;
}
