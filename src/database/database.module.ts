import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SnakeNamingStrategy from 'typeorm-naming-strategy';
import Carts from '../database/entities/carts.entity';
import CartItems from './entities/cart-items.entity';
import { Orders } from '../database/entities/orders.entity';
import { Users } from '../database/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: +process.env.PGPORT,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      entities: ['/dist/database/entities/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    TypeOrmModule.forFeature([Carts, CartItems, Orders, Users]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
