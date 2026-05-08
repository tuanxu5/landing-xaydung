import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  shortDescription?: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  salePrice?: number;

  @Prop({ required: true })
  unit: string; // m2, m3, kg, tấn, bao, viên, etc.

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  sku?: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  thumbnail?: string;

  @Prop({ type: Object })
  specifications?: Record<string, any>; // Thông số kỹ thuật

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  manufacturer?: string; // Nhà sản xuất

  @Prop()
  origin?: string; // Xuất xứ
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });
