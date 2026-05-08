import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class UpdateContactMessageDto {
  @IsString()
  @IsOptional()
  @IsEnum(['pending', 'read', 'replied', 'archived'])
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  repliedAt?: Date;
}
