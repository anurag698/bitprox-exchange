// apps/matching-engine/orderBook.ts

/**
 * OrderBook Class
 * In-memory bid/ask order book for matching engine microservice
 * Supports add order, match, cancel (skeleton)
 */

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

export class OrderBook {
  private bids: Order[] = [];
  private asks: Order[] = [];

  addOrder(order: Order) {
    if (order.type === 'buy') {
      this.bids.push(order);
      this.bids.sort((a, b) => b.price - a.price || a.timestamp - b.timestamp);
    } else {
      this.asks.push(order);
      this.asks.sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);
    }
    // TODO: call matchOrders() after adding
  }

  cancelOrder(orderId: string) {
    this.bids = this.bids.filter(o => o.id !== orderId);
    this.asks = this.asks.filter(o => o.id !== orderId);
  }

  matchOrders() {
    // TODO: implement price-time priority matching logic
  }

  getOrderBook() {
    return {
      bids: this.bids,
      asks: this.asks,
    };
  }
}
