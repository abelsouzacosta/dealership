import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PhoneNumber = {
  number: string;
};

export type Address = {
  country: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  zip_code: string;
};

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

  @Prop({ required: true })
  phone_numbers: PhoneNumber[];

  @Prop({ required: true })
  addresses: Address[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
