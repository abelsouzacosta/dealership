import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AddCarToCategoryDto {
  @IsNotEmpty()
  @IsMongoId()
  car_id: string;
}
