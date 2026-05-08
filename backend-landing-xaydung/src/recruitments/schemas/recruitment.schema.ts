import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecruitmentDocument = Recruitment & Document;

@Schema({ timestamps: true })
export class Recruitment {
  @Prop({ required: true })
  banner: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  jobDescription: string;

  @Prop({ required: true })
  candidateRequirements: string;

  @Prop({ required: true })
  salary: string;

  @Prop({ required: true })
  benefits: string;

  @Prop({ required: true })
  contact: string;

  @Prop({ required: true })
  applicationDeadline: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const RecruitmentSchema = SchemaFactory.createForClass(Recruitment);
