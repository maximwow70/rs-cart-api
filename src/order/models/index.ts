import { CartItem } from '../../cart';

export type Order = {
  id?: string;
  userId: string;
  cartId: string;
  items: CartItem[];
  payment: {
    type: string;
    address?: any;
    creditCard?: any;
  };
  delivery: {
    type: string;
    address: any;
  };
  comments: string;
  status: 'IN_PROGRESS' | 'ORDERED';
  total: number;
};
