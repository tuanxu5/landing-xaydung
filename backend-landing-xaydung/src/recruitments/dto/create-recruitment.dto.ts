import { IsString, IsNotEmpty, IsNumber, IsDateString, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateRecruitmentDto {
  @IsString()
  @IsNotEmpty()
  banner: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  candidateRequirements: string;

  @IsString()
  @IsNotEmpty()
  salary: string;

  @IsString()
  @IsNotEmpty()
  benefits: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsDateString()
  applicationDeadline: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
