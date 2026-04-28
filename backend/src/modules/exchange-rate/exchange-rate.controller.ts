import { Controller, Get, Patch, Body } from '@nestjs/common';
import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { PrismaService } from '../../config/database/prisma.service';

class UpdateRateDto {
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  rate: number;
}

@Controller('api/exchange-rate')
export class ExchangeRateController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getRate() {
    try {
      // Try to find existing rate
      let rateRecord = await this.prisma.exchangeRate.findFirst({
        orderBy: { updatedAt: 'desc' },
      });

      if (!rateRecord) {
        // Create default rate if none exists
        rateRecord = await this.prisma.exchangeRate.create({
          data: { rate: 385 },
        });
      }

      return {
        id: rateRecord.id,
        rate: Number(rateRecord.rate),
        updatedAt: rateRecord.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('ExchangeRate GET error:', error);
      return { id: 'default', rate: 385, updatedAt: new Date().toISOString() };
    }
  }

  @Patch()
  async updateRate(@Body() dto: UpdateRateDto) {
    try {
      // Find existing rate
      let rateRecord = await this.prisma.exchangeRate.findFirst({
        orderBy: { updatedAt: 'desc' },
      });

      if (rateRecord) {
        // Update existing
        rateRecord = await this.prisma.exchangeRate.update({
          where: { id: rateRecord.id },
          data: { rate: dto.rate },
        });
      } else {
        // Create new
        rateRecord = await this.prisma.exchangeRate.create({
          data: { rate: dto.rate },
        });
      }

      return {
        id: rateRecord.id,
        rate: Number(rateRecord.rate),
        updatedAt: rateRecord.updatedAt.toISOString(),
      };
    } catch (error) {
      console.error('ExchangeRate UPDATE error:', error);
      throw error;
    }
  }
}