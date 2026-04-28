import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/database/prisma.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Generar código único CAP-XXXXX
  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'CAP-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { orderHistorial: { orderBy: { createdAt: 'desc' } } }
    });
    return orders.map(o => ({ 
      ...o, 
      total: Number(o.total),
      historial: o.orderHistorial 
    }));
  }

  async findMyOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(o => ({ ...o, total: Number(o.total) }));
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({ 
      where: { id },
      include: { orderHistorial: { orderBy: { createdAt: 'desc' } } }
    });
    if (!order) throw new NotFoundException('Order not found');
    return { 
      ...order, 
      total: Number(order.total),
      historial: order.orderHistorial 
    };
  }

  async create(dto: CreateOrderDto, userId?: string) {
    // Generar código único
    let code: string;
    let exists = true;
    do {
      code = this.generateCode();
      const existing = await this.prisma.order.findUnique({ where: { codigo: code } });
      exists = !!existing;
    } while (exists);

    const order = await this.prisma.order.create({
      data: {
        codigo: code,
        customerName: dto.customerName,
        phone: dto.phone,
        items: dto.items as unknown as Prisma.InputJsonValue,
        total: dto.total,
        deliveryMethod: dto.deliveryMethod,
        address: dto.address,
        notes: dto.notes,
        userId: userId || null,
        orderHistorial: {
          create: {
            estado: 'PENDING',
          }
        }
      },
      include: { orderHistorial: true }
    });
    return { 
      ...order, 
      total: Number(order.total),
      historial: order.orderHistorial 
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { 
        status: dto.status,
        motivoCancelacion: dto.motivo || null,
      },
      include: { orderHistorial: { orderBy: { createdAt: 'desc' } } }
    });

    // Agregar al historial
    if (dto.status) {
      await this.prisma.pedidoHistorial.create({
        data: {
          orderId: id,
          estado: dto.status,
        }
      });
    }

    return { 
      ...order, 
      total: Number(order.total),
      historial: order.orderHistorial 
    };
  }
}