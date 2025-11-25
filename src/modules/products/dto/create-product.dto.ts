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

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'O preço deve ser maior que zero' })
  @Type(() => Number) // Garante que transforme string "10.50" em number 10.50
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
