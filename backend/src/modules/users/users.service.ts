import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';
import { instanceToPlain } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
    return users.map((u) => instanceToPlain(u));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return instanceToPlain(user);
  }

  async updateRole(id: string, role: 'ADMIN' | 'USER') {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
    return instanceToPlain(user);
  }
}