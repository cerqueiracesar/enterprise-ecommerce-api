import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'MacBook Pro M3', description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'O notebook mais rápido...',
    description: 'Descrição detalhada',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'macbook-pro-m3', description: 'URL amigável única' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 12999.9, description: 'Preço em reais' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'O preço deve ser maior que zero' })
  @Type(() => Number) // Garante que transforme string "10.50" em number 10.50
  price: number;

  @ApiProperty({ example: 50, description: 'Quantidade em estoque' })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 'https://img.com/foto.png' })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
