import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Carts from '../../database/entities/carts.entity';
import { Cart } from '../models/index';
import CartItems from '../../database/entities/cart-items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Carts)
    private readonly cartRepo: Repository<Carts>,
    @InjectRepository(CartItems)
    private readonly cartItemsRepo: Repository<CartItems>,
  ) {}

  async getProductsByIds(ids: string[]): Promise<any[]> {
    const params: DocumentClient.BatchGetItemInput = {
      RequestItems: {
        products: {
          Keys: ids.map(id => ({ id })),
        },
      },
    };

    const response = await dynamoDb.batchGet(params).promise();
    return response.Responses.products;
  }

  async findByUserId(userId: string): Promise<Cart> {
    try {
      const cartEntity = await this.cartRepo.findOne({
        where: { user_id: userId },
        relations: ['items'],
      });

      return {
        id: cartEntity.id,
        items: await this.getProductsByIds(
          cartEntity.items.map(item => item.product_id),
        ),
      };
    } catch (e) {
      throw e;
    }
  }

  async createByUserId(userId: string) {
    try {
      const cartCreateResult = await this.cartRepo.insert({
        user_id: userId,
        status: 'OPEN',
      });

      return {
        id: cartCreateResult.raw[0].id,
        items: [],
      };
    } catch (e) {
      throw e;
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    try {
      await this.cartRepo.update(
        {
          id,
        },
        {
          items: items.map(i => ({
            product_id: i.product.id,
            count: i.count,
          })),
        },
      );

      return {
        id,
        items,
      };
    } catch (e) {
      throw e;
    }
  }

  async removeByUserId(userId): Promise<void> {
    try {
      await this.cartRepo.delete({
        user_id: userId,
      });
    } catch (e) {
      throw e;
    }
  }
}
