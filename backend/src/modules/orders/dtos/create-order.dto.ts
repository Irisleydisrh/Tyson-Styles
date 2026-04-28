import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsEnum, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

// Flexible item - doesn't require all fields
class OrderItemDto {
  @IsOptional()
  @IsString()
  id?: string;
  
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
  
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0)
  total: number;

  @IsEnum(['DOMICILIO', 'RECOGER'])
  deliveryMethod: 'DOMICILIO' | 'RECOGER';

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}