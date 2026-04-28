import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';
import { instanceToPlain } from 'class-transformer';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private slugify(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async findAll(includeInactive = false, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: includeInactive ? {} : { isActive: true },
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: includeInactive ? {} : { isActive: true },
      }),
    ]);
    return {
      data: products.map(p => ({
        ...instanceToPlain(p),
        priceUSD: Number(p.priceUSD),
        category: p.category ? instanceToPlain(p.category) : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return {
      ...instanceToPlain(product),
      priceUSD: Number(product.priceUSD),
    };
  }

  async findFeatured() {
    const products = await this.prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return products.map(p => ({
      ...instanceToPlain(p),
      priceUSD: Number(p.priceUSD),
    }));
  }

  async create(dto: CreateProductDto) {
    const slug = dto.slug || this.slugify(dto.name);
    const existing = await this.prisma.product.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Slug already exists');

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        priceUSD: dto.priceUSD,
        categoryId: dto.categoryId,
        imageUrl: dto.imageUrl,
        stock: dto.stock ?? 0,
        isActive: dto.isActive ?? true,
        featured: dto.featured ?? false,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return {
      ...instanceToPlain(product),
      priceUSD: Number(product.priceUSD),
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    if (dto.name && !dto.slug) dto.slug = this.slugify(dto.name);
    const product = await this.prisma.product.update({
      where: { id },
      data: { ...dto, priceUSD: dto.priceUSD },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    return {
      ...instanceToPlain(product),
      priceUSD: Number(product.priceUSD),
    };
  }

  async delete(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted' };
  }
}