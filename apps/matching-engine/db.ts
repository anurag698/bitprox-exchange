// apps/matching-engine/db.ts
/**
 * Persistent storage integration stub for orders and trades
 */
import { Pool } from 'pg';
import { Order } from './orderBook';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bitprox',
  port: +(process.env.DB_PORT || 5432),
});

export async function saveOrder(order: Order) {
  await pool.query('INSERT INTO orders (id, user_id, pair, price, quantity, type, timestamp) VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [order.id, order.userId, order.pair, order.price, order.quantity, order.type, order.timestamp]);
}

export async function saveTrade(trade: any) {
  await pool.query('INSERT INTO trades (buy_order_id, sell_order_id, price, quantity, timestamp) VALUES ($1,$2,$3,$4,$5)',
    [trade.buyOrderId, trade.sellOrderId, trade.price, trade.quantity, trade.timestamp]);
}
