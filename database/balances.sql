-- database/balances.sql

CREATE TABLE IF NOT EXISTS balances (
  user_id VARCHAR NOT NULL,
  currency VARCHAR NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 0,
  updated_at BIGINT NOT NULL,
  PRIMARY KEY (user_id, currency)
);

CREATE INDEX IF NOT EXISTS idx_balances_user_currency ON balances(user_id, currency);
