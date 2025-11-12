// apps/matching-engine/websocket.ts

/**
 * WebSocket server for live order book/trades streaming (BitProX Matching Engine)
 */
import { createServer } from 'http';
import { Server } from 'ws';
import express, { Application } from 'express';
import { OrderBook, Order } from './orderBook';
import { match } from './matchLogic';

const app: Application = express();
const server = createServer(app);
const wss = new Server({ server });
const orderBook = new OrderBook();

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'orderbook', data: orderBook.getOrderBook() }));
});

// Broadcast to all WS clients
function broadcast(event: string, data: any) {
  const msg = JSON.stringify({ type: event, data });
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

app.use(express.json());

app.post('/order', (req, res) => {
  const order: Order = req.body;
  orderBook.addOrder(order);
  const matchResult = match(orderBook);
  (orderBook as any).bids = matchResult.updatedBook.bids;
  (orderBook as any).asks = matchResult.updatedBook.asks;
  broadcast('orderbook', matchResult.updatedBook);
  broadcast('trade', matchResult.trades);
  res.send({ message: 'Order received', trades: matchResult.trades, orderBook: matchResult.updatedBook });
});

app.get('/orderbook', (req, res) => {
  res.send(orderBook.getOrderBook());
});

server.listen(4003, () => {
  console.log('Matching Engine (REST + WS) running on port 4003');
});

export default app;
