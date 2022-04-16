import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PhoneNumberType {
  Comercial = 'Comercial',
  Residencial = 'Residencial',
  Pessoal = 'Pessoal',
}

@Schema({ _id: false })
export class PhoneNumber {
  @Prop({ required: true, enum: PhoneNumberType })
  type: string;

  @Prop({ required: true, type: String })
  number: string;

  @Prop({ required: true, type: Boolean, default: true })
  active: boolean;
}

const PhoneNumberSchema = SchemaFactory.createForClass(PhoneNumber);

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
}

export const ClientSchema = SchemaFactory.createForClass(Client);
