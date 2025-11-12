// apps/matching-engine/__tests__/orderBook.test.ts

import { OrderBook, Order, OrderType } from '../orderBook';

describe('OrderBook', () => {
  let orderBook: OrderBook;

  beforeEach(() => {
    orderBook = new OrderBook();
  });

  it('adds buy and sell orders sorted correctly', () => {
    orderBook.addOrder({ id: '1', userId: 'u1', pair: 'BTC/USDT', price: 1000, quantity: 1, type: 'buy', timestamp: 1 });
    orderBook.addOrder({ id: '2', userId: 'u2', pair: 'BTC/USDT', price: 1010, quantity: 2, type: 'buy', timestamp: 2 });
    orderBook.addOrder({ id: '3', userId: 'u3', pair: 'BTC/USDT', price: 990, quantity: 3, type: 'sell', timestamp: 3 });
    orderBook.addOrder({ id: '4', userId: 'u4', pair: 'BTC/USDT', price: 995, quantity: 4, type: 'sell', timestamp: 4 });

    expect(orderBook.getOrderBook().bids.map(o => o.id)).toEqual(['2','1']);
    expect(orderBook.getOrderBook().asks.map(o => o.id)).toEqual(['3','4']);
  });

  it('cancels orders correctly', () => {
    orderBook.addOrder({ id: '1', userId: 'u1', pair: 'BTC/USDT', price: 1000, quantity: 1, type: 'buy', timestamp: 1 });
    orderBook.cancelOrder('1');
    expect(orderBook.getOrderBook().bids.length).toBe(0);
  });
});
