// apps/balance/db.ts
/**
 * Persistent storage for balance microservice (PostgreSQL)
 */
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bitprox',
  port: +(process.env.DB_PORT || 5432),
});

export async function getBalances(userId: string) {
  const result = await pool.query('SELECT currency, balance FROM balances WHERE user_id = $1', [userId]);
  return result.rows;
}

export async function updateBalance(userId: string, currency: string, delta: number) {
  await pool.query('
    INSERT INTO balances (user_id, currency, balance, updated_at) VALUES ($1,$2,$3,$4)
    ON CONFLICT (user_id, currency) DO UPDATE SET balance = balances.balance + $3, updated_at = $4',
    [userId, currency, delta, Date.now()]
  );
}
