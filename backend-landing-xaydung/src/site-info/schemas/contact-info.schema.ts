import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ContactInfo extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  facebookUrl: string;

  @Prop()
  zaloUrl: string;

  @Prop()
  youtubeUrl: string;

  @Prop()
  linkedinUrl: string;

  @Prop()
  mapEmbedUrl: string;

  @Prop()
  workingHours: string;

  @Prop()
  taxCode: string;

  @Prop()
  description: string;
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);
