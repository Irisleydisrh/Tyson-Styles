import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../config/database/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async refresh(refreshToken: string) {
    const token = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({ where: { id: token.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // Delete old token and create new one (token rotation)
    await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
    
    const refreshExpiresDays = parseInt(this.configService.get<string>('jwt.refreshExpiresDays') || '7');
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + refreshExpiresDays);
    const newToken = this.generateRandomToken();
    await this.prisma.refreshToken.create({ data: { userId: user.id, token: newToken, expiresAt: newExpiresAt } });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      refreshToken: newToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });
    if (!user) return null;
    return instanceToPlain(user);
  }

  private generateTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const refreshExpiresDays = parseInt(this.configService.get<string>('jwt.refreshExpiresDays') || '7');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshExpiresDays);
    const refreshToken = this.generateRandomToken();

    this.prisma.refreshToken.create({
      data: { userId: user.id, token: refreshToken, expiresAt },
    });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }

  private generateRandomToken() {
    return require('crypto').randomBytes(64).toString('hex');
  }
}