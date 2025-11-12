// apps/matching-engine/matchLogic.ts

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

/**
 * Implements price-time priority order matching
 * Matches highest bid with lowest ask (fills/partial fills)
 */
export function match(orderBook: OrderBook): MatchResult {
  const trades = [];
  let bids = orderBook.getOrderBook().bids.slice(); // highest to lowest price
  let asks = orderBook.getOrderBook().asks.slice(); // lowest to highest price

  while (bids.length && asks.length && bids[0].price >= asks[0].price) {
    // Fill at price of earliest taker's order (usually ask price)
    const bid = bids[0];
    const ask = asks[0];
    const fillQty = Math.min(bid.quantity, ask.quantity);
    const tradePrice = ask.price;
    const timestamp = Date.now();

    trades.push({
      buyOrderId: bid.id,
      sellOrderId: ask.id,
      price: tradePrice,
      quantity: fillQty,
      timestamp,
    });

    bid.quantity -= fillQty;
    ask.quantity -= fillQty;

    if (bid.quantity === 0) bids.shift();
    if (ask.quantity === 0) asks.shift();
  }
  // Return updated orderbook and trades
  return {
    trades,
    updatedBook: { bids, asks },
  };
}
