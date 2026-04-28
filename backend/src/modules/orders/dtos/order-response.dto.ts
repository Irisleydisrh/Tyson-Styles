import { Expose, Type } from 'class-transformer';

export class OrderItemResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() price: number;
  @Expose() quantity: number;
}

export class OrderResponseDto {
  @Expose() id: string;
  @Expose() customerName: string;
  @Expose() phone: string;
  @Expose() items: OrderItemResponseDto[];
  @Expose() total: number;
  @Expose() deliveryMethod: string;
  @Expose() address: string | null;
  @Expose() notes: string | null;
  @Expose() status: string;
  @Expose() userId: string | null;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}