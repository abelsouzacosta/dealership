import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RemovePhoneDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  phone_id: string;
}
