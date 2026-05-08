import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../schemas';

export class UpdateApplicationDto {
  @IsEnum(ApplicationStatus)
  @IsOptional()
  status?: ApplicationStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
