// apps/matching-engine/index.ts

/**
 * Matching Engine Service Entry Point (with order matching via REST)
 */
import express from 'express';
import { OrderBook, Order } from './orderBook';
import { match } from './matchLogic';

const app = express();
const orderBook = new OrderBook();

app.use(express.json());

// New order endpoint: Add order and trigger matching
app.post('/order', (req, res) => {
  const order: Order = req.body;
  orderBook.addOrder(order);
  const matchResult = match(orderBook);
  // After matching, update internal book state and return result
  // Overwrite bids/asks in orderBook with matchResult.updatedBook
  (orderBook as any).bids = matchResult.updatedBook.bids;
  (orderBook as any).asks = matchResult.updatedBook.asks;
  res.send({ message: 'Order received', trades: matchResult.trades, orderBook: matchResult.updatedBook });
});

// Get current order book
app.get('/orderbook', (req, res) => {
  res.send(orderBook.getOrderBook());
});

app.listen(4003, () => {
  console.log('Matching Engine Service running on port 4003');
});

export default app;
