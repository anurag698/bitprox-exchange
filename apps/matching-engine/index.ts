// Update apps/matching-engine/index.ts to add history endpoints
import express from 'express';
import { OrderBook, Order } from './orderBook';
import { match } from './matchLogic';
import { addHistoryRoutes } from './history';

const app = express();
const orderBook = new OrderBook();

app.use(express.json());

app.post('/order', (req, res) => {
  const order: Order = req.body;
  orderBook.addOrder(order);
  const matchResult = match(orderBook);
  // Overwrite bids/asks for real-time consistency
  (orderBook as any).bids = matchResult.updatedBook.bids;
  (orderBook as any).asks = matchResult.updatedBook.asks;
  res.send({ message: 'Order received', trades: matchResult.trades, orderBook: matchResult.updatedBook });
});

app.get('/orderbook', (req, res) => {
  res.send(orderBook.getOrderBook());
});

addHistoryRoutes(app);

app.listen(4003, () => {
  console.log('Matching Engine Service running on port 4003');
});

export default app;
