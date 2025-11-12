// apps/balance/ledger.ts
/**
 * Ledger event logging for balance microservice
 */
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'bitprox',
  port: +(process.env.DB_PORT || 5432),
});

export async function logLedgerEvent({ userId, currency, amount, event, refId }: {
  userId: string;
  currency: string;
  amount: number;
  event: string;
  refId?: string;
}) {
  await pool.query(
    'INSERT INTO ledger (user_id, currency, amount, event, ref_id, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
    [userId, currency, amount, event, refId, Date.now()]
  );
}

export async function getLedgerHistory(userId: string, currency?: string) {
  const result = await pool.query(
    currency
      ? 'SELECT * FROM ledger WHERE user_id = $1 AND currency = $2 ORDER BY created_at DESC LIMIT 100'
      : 'SELECT * FROM ledger WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
    currency ? [userId, currency] : [userId]
  );
  return result.rows;
}
