import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsMongoId, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salePrice?: number;

  @IsString()
  unit: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsMongoId()
  category: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsOptional()
  specifications?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  origin?: string;
}
