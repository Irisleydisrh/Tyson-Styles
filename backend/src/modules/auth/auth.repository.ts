import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { email: string; password: string; name?: string; phone?: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
      },
    });
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({ where: { token } });
  }

  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  }

  async deleteRefreshToken(token: string) {
    return this.prisma.refreshToken.delete({ where: { token } });
  }

  async deleteUserRefreshTokens(userId: string) {
    return this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async updateRefreshToken(oldToken: string, userId: string, newToken: string, newExpiresAt: Date) {
    await this.prisma.refreshToken.delete({ where: { token: oldToken } });
    return this.prisma.refreshToken.create({ data: { userId, token: newToken, expiresAt: newExpiresAt } });
  }
}