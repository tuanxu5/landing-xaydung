import { IsString, IsEmail, IsOptional, IsBoolean, IsEnum, IsPhoneNumber } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
