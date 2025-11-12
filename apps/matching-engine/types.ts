// apps/matching-engine/types.ts

export type OrderType = 'buy' | 'sell';

export interface Order {
  id: string;
  userId: string;
  pair: string;
  price: number;
  quantity: number;
  type: OrderType;
  timestamp: number;
}
