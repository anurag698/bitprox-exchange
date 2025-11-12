// apps/matching-engine/history.ts
/**
 * Endpoints to fetch order and trade history from PostgreSQL
 */
import express from 'express';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bitprox',
  port: +(process.env.DB_PORT || 5432),
});

export function addHistoryRoutes(app: express.Application) {
  // Fetch user order history
  app.get('/history/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY timestamp DESC LIMIT 100', [userId]);
    res.send(result.rows);
  });

  // Fetch trade history for a trading pair
  app.get('/history/trades/:pair', async (req, res) => {
    const { pair } = req.params;
    const result = await pool.query(
      'SELECT * FROM trades WHERE buy_order_id IN (SELECT id FROM orders WHERE pair = $1) OR sell_order_id IN (SELECT id FROM orders WHERE pair = $1) ORDER BY timestamp DESC LIMIT 100',
      [pair]
    );
    res.send(result.rows);
  });
}
