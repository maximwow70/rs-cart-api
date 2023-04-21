import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './services';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
