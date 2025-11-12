-- database/orders.sql

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  pair VARCHAR NOT NULL,
  price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL,
  type VARCHAR(4) NOT NULL CHECK (type IN ('buy', 'sell')),
  timestamp BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_pair ON orders(pair);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
