import { Injectable } from '@nestjs/common';

import { Order } from '../models';
import { Orders as OrderEntity } from '../../database/entities/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../../cart';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepo: Repository<OrderEntity>,
    private readonly cartService: CartService,
  ) {}

  async findById(orderId: string): Promise<Order> {
    const orderEntity = await this.ordersRepo.findOne({
      where: { id: orderId },
    });

    const cart = await this.cartService.findByUserId(orderEntity.user_id);

    return {
      id: orderEntity.id,
      userId: orderEntity.user_id,
      cartId: orderEntity.cart_id,
      items: cart.items,
      payment: orderEntity.payment,
      delivery: orderEntity.delivery,
      comments: orderEntity.comments,
      status: orderEntity.status,
      total: orderEntity.total,
    };
  }

  async create(data: Order) {
    const order: OrderEntity = {
      id: data.id,
      user_id: data.userId,
      cart_id: data.cartId,
      payment: data.payment,
      delivery: data.delivery,
      comments: data.comments,
      status: 'IN_PROGRESS',
      total: data.total,
    };

    try {
      await this.ordersRepo.manager.transaction(
        async transactionalEntityManager => {
          await transactionalEntityManager.insert(OrderEntity, order);
          await transactionalEntityManager.insert(OrderEntity, {
            ...order,
            status: 'ORDERED',
          });
        },
      );
    } catch (e) {
      throw e;
    }
    return order;
  }

  async update(orderId, data): Promise<Order> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    try {
      await this.ordersRepo.update(
        {
          id: orderId,
        },
        {
          ...data,
        },
      );

      return await this.findById(orderId);
    } catch (e) {
      throw e;
    }
  }
}
