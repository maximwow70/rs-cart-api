import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import CartItems from './cart_items.entity';

@Entity('carts')
class Carts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'date', nullable: false })
  created_at: Date;

  @Column({ type: 'date', nullable: false })
  updated_at: Date;

  @Column({ type: 'enum', enum: ['OPEN', 'ORDERED'], nullable: false })
  status: 'OPEN' | 'ORDERED';

  @OneToMany(
    () => CartItems,
    cart_item => cart_item.cart_id,
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'cart_id' })
  items: CartItems[];
}

export default Carts;
