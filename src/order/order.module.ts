import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './services';
import { CartService } from '../cart/index';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [OrderService, CartService],
  exports: [OrderService],
})
export class OrderModule {}
