import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsUUID()
  productId: string;

  @IsString()
  @IsNotEmpty()
  authorName: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;
}