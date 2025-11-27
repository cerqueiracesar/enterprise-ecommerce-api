import {
  IsNotEmpty,
  IsInt,
  Min,
  IsUUID,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true }) // Valida cada item dentro do array
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
