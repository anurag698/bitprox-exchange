-- database/trades.sql

CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  buy_order_id VARCHAR NOT NULL,
  sell_order_id VARCHAR NOT NULL,
  price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL,
  timestamp BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trades_buy_order ON trades(buy_order_id);
CREATE INDEX IF NOT EXISTS idx_trades_sell_order ON trades(sell_order_id);
CREATE INDEX IF NOT EXISTS idx_trades_time ON trades(timestamp);
