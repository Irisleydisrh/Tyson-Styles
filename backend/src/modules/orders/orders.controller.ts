import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { Request } from 'express';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  // Solo admin con API key puede ver todos los pedidos
  @UseGuards(ApiKeyGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('my')
  findMyOrders() {
    // Para usuarios autenticados si hay login
    return [];
  }

  @Post()
  create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    // Público - cualquiera puede crear un pedido (sin Auth)
    return this.ordersService.create(dto);
  }

  @Patch(':id/status')
  // Solo admin con API key puede cambiar estado
  @UseGuards(ApiKeyGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}