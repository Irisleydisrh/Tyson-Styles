import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['PENDING', 'CONFIRMED', 'PREPARING', 'SENT', 'DELIVERED', 'CANCELLED'])
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'SENT' | 'DELIVERED' | 'CANCELLED';

  @IsOptional()
  @IsString()
  motivo?: string;
}