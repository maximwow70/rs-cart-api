import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Carts from './carts.entity';

@Entity('cart_items')
class CartItems {
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column({ type: 'integer', nullable: false })
  count: number;

  @ManyToOne(() => Carts)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart_id: Carts;
}

export default CartItems;
