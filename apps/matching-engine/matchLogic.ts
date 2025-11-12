// apps/matching-engine/matchLogic.ts

/**
 * Core matching logic for BitProX matching engine
 * Processes bids/asks for single pair, supports price-time priority
 * Fills, partial fills, and emits trades (skeleton)
 */
import { OrderBook, Order } from './orderBook';

export interface MatchResult {
  trades: Array<{
    buyOrderId: string;
    sellOrderId: string;
    price: number;
    quantity: number;
    timestamp: number;
  }>;
  updatedBook: {
    bids: Order[];
    asks: Order[];
  };
}

export function match(orderBook: OrderBook): MatchResult {
  // Stub: Future - actual matching engine logic here
  const trades = [];
  // TODO: iterate bids/asks; match at compatible prices (bid >= ask)
  return {
    trades,
    updatedBook: orderBook.getOrderBook(),
  };
}
