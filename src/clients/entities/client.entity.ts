import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PhoneNumberType {
  Comercial = 'Comercial',
  Residencial = 'Residencial',
  Pessoal = 'Pessoal',
}

@Schema({})
export class PhoneNumber {
  @Prop({ required: true, enum: PhoneNumberType })
  type: string;

  @Prop({ required: true, type: String })
  number: string;

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean;
}
const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);

@Schema({})
export class Address {
  @Prop({ required: false, type: String, default: 'Brasil' })
  country?: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  zipcode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({
  timestamps: true,
  collection: 'clients',
})
export class Client {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  cpf: string;

  @Prop({ required: true, type: [PhoneNumberSchema] })
  phone_numbers: PhoneNumber[];

  @Prop({ required: true, type: [AddressSchema] })
  addresses: Address[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
