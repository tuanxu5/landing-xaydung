import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  parent?: Types.ObjectId;

  @Prop()
  image?: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1 });
