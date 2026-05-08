import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class Certificate {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  fileUrl: string; // PDF or Image

  @Prop({ required: true, enum: ['pdf', 'image'] })
  fileType: string;

  @Prop()
  description?: string;

  @Prop()
  issuedDate?: Date;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
