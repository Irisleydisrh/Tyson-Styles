import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';

@Module({
  controllers: [ExchangeRateController],
})
export class ExchangeRateModule {}