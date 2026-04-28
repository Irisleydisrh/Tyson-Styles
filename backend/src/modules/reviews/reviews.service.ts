import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';
import { CreateReviewDto } from './dtos/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId, approved: true },
      orderBy: { createdAt: 'desc' },
    });
    return reviews;
  }

  async create(dto: CreateReviewDto, userId?: string) {
    const review = await this.prisma.review.create({
      data: {
        productId: dto.productId,
        authorName: dto.authorName,
        rating: dto.rating,
        comment: dto.comment,
        userId: userId || null,
        approved: false, // Admin must approve
      },
    });
    return review;
  }

  async approve(id: string) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { approved: true },
    });
    return review;
  }
}