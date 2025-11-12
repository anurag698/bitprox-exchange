-- database/ledger.sql

CREATE TABLE IF NOT EXISTS ledger (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  currency VARCHAR NOT NULL,
  amount NUMERIC NOT NULL,
  event VARCHAR NOT NULL, -- deposit, withdraw, trade, transfer
  ref_id VARCHAR,         -- reference to tx/order/trade/transfer
  created_at BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ledger_user ON ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_event ON ledger(event);
