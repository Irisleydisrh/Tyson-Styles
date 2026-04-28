import { Expose, Type } from 'class-transformer';

export class CategoryInfoDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() slug: string;
}

export class ProductResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() slug: string;
  @Expose() description: string | null;
  @Expose() price: number;
  @Expose() categoryId: string | null;
  @Expose() @Type(() => CategoryInfoDto)
  category: CategoryInfoDto | null;
  @Expose() imageUrl: string | null;
  @Expose() stock: number;
  @Expose() active: boolean;
  @Expose() featured: boolean;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}