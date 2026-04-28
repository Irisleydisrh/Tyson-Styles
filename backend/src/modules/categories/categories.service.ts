import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';
import { instanceToPlain } from 'class-transformer';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private slugify(s: string): string {
    return s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    return categories.map((c) => instanceToPlain(c));
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return instanceToPlain(category);
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    if (!category) throw new NotFoundException('Category not found');
    return instanceToPlain(category);
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || this.slugify(dto.name);
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Slug already exists');

    const category = await this.prisma.category.create({
      data: { name: dto.name, slug, icon: dto.icon, sortOrder: dto.sortOrder ?? 0 },
    });
    return instanceToPlain(category);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (dto.name && !dto.slug) dto.slug = this.slugify(dto.name);
    const category = await this.prisma.category.update({
      where: { id },
      data: { ...dto, slug: dto.slug },
    });
    return instanceToPlain(category);
  }

  async delete(id: string) {
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted' };
  }
}