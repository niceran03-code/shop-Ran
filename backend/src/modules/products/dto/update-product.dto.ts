// backend/src/modules/products/dto/update-product.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiPropertyOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiPropertyOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  categoryId?: number;
}
