import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactMessageDocument = ContactMessage & Document;

@Schema({ timestamps: true })
export class ContactMessage extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  subject: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'pending', enum: ['pending', 'read', 'replied', 'archived'] })
  status: string;

  @Prop()
  notes: string;

  @Prop()
  repliedAt: Date;
}

export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
