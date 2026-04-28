import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() slug: string;
  @Expose() icon: string | null;
  @Expose() sortOrder: number;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}