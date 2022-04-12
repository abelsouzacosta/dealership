import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'cars',
})
export class Car {
  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  fabrication_year: number;

  @Prop({ required: true })
  model_year: number;

  @Prop({ required: true, unique: true })
  license_plate: string;
}

export type CarDocument = Car & Document;
export const CarSchema = SchemaFactory.createForClass(Car);
