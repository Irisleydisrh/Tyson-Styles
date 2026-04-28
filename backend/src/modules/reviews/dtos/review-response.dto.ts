import { Expose } from 'class-transformer';

export class ReviewResponseDto {
  @Expose() id: string;
  @Expose() productId: string;
  @Expose() authorName: string;
  @Expose() rating: number;
  @Expose() comment: string | null;
  @Expose() approved: boolean;
  @Expose() createdAt: Date;
}