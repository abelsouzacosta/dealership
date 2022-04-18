import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class RemoveAddressDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  address_id: string;
}
