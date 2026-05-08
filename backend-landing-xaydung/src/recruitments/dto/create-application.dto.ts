import { IsString, IsNotEmpty, IsEmail, IsOptional, IsMongoId } from 'class-validator';

export class CreateApplicationDto {
  @IsMongoId()
  @IsNotEmpty()
  recruitmentId: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  cvUrl: string;

  @IsString()
  @IsOptional()
  coverLetter?: string;
}
