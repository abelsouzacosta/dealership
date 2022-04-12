import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Car } from 'src/cars/entities/car.entity';

@Schema({
  timestamps: true,
  collection: 'categories',
})
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
  })
  cars?: Car[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
