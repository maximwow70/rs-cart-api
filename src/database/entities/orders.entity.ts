import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Carts from './carts.entity';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @OneToOne(() => Carts)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart_id: string;

  @Column({ type: 'json', nullable: false })
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };

  @Column({ type: 'json', nullable: false })
  delivery: {
    type: string;
    address: any;
  };

  @Column({ type: 'text', nullable: false })
  comments: string;

  @Column({ type: 'enum', enum: ['IN_PROGRESS', 'ORDERED'], nullable: false })
  status: 'IN_PROGRESS' | 'ORDERED';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
