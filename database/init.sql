-- BitProX Exchange Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- USERS & AUTHENTICATION
-- ======================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    referral_code VARCHAR(32) UNIQUE,
    role VARCHAR(10) NOT NULL DEFAULT 'USER', -- USER, ADMIN
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_referral_code ON users(referral_code);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(512) NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token);

-- ======================
-- ASSETS & MARKETS
-- ======================

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(10) NOT NULL UNIQUE, -- BTC, ETH, USDT, etc.
    name VARCHAR(100) NOT NULL,
    decimals INT NOT NULL DEFAULT 8,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_symbol ON assets(symbol);

CREATE TABLE markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    base_asset_id UUID NOT NULL REFERENCES assets(id),
    quote_asset_id UUID NOT NULL REFERENCES assets(id),
    symbol VARCHAR(20) NOT NULL UNIQUE, -- BTC-USDT, ETH-USDT, etc.
    min_order_size DECIMAL(36, 18) NOT NULL,
    price_precision INT NOT NULL DEFAULT 2,
    quantity_precision INT NOT NULL DEFAULT 8,
    maker_fee_percent DECIMAL(5, 4) NOT NULL DEFAULT 0.001, -- 0.1%
    taker_fee_percent DECIMAL(5, 4) NOT NULL DEFAULT 0.002, -- 0.2%
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_markets_symbol ON markets(symbol);
CREATE INDEX idx_markets_base_asset ON markets(base_asset_id);
CREATE INDEX idx_markets_quote_asset ON markets(quote_asset_id);

-- ======================
-- BALANCES & LEDGER
-- ======================

CREATE TABLE balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id),
    available DECIMAL(36, 18) NOT NULL DEFAULT 0,
    locked DECIMAL(36, 18) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, asset_id)
);

CREATE INDEX idx_balances_user_id ON balances(user_id);
CREATE INDEX idx_balances_asset_id ON balances(asset_id);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_id UUID NOT NULL REFERENCES assets(id),
    amount DECIMAL(36, 18) NOT NULL,
    balance_after DECIMAL(36, 18) NOT NULL,
    entry_type VARCHAR(50) NOT NULL, -- DEPOSIT, WITHDRAWAL, TRADE_BUY, TRADE_SELL, FEE, LOCK, UNLOCK
    reference_id UUID, -- order_id, trade_id, withdrawal_id, etc.
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_user_id ON ledger_entries(user_id);
CREATE INDEX idx_ledger_asset_id ON ledger_entries(asset_id);
CREATE INDEX idx_ledger_reference_id ON ledger_entries(reference_id);
CREATE INDEX idx_ledger_created_at ON ledger_entries(created_at DESC);

-- ======================
-- ORDERS & TRADES
-- ======================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    market_id UUID NOT NULL REFERENCES markets(id),
    side VARCHAR(4) NOT NULL, -- BUY, SELL
    type VARCHAR(10) NOT NULL, -- LIMIT, MARKET
    price DECIMAL(36, 18), -- NULL for market orders
    quantity DECIMAL(36, 18) NOT NULL,
    filled_quantity DECIMAL(36, 18) NOT NULL DEFAULT 0,
    remaining_quantity DECIMAL(36, 18) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, OPEN, PARTIAL, FILLED, CANCELLED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_market_id ON orders(market_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES markets(id),
    maker_order_id UUID NOT NULL REFERENCES orders(id),
    taker_order_id UUID NOT NULL REFERENCES orders(id),
    maker_user_id UUID NOT NULL REFERENCES users(id),
    taker_user_id UUID NOT NULL REFERENCES users(id),
    price DECIMAL(36, 18) NOT NULL,
    quantity DECIMAL(36, 18) NOT NULL,
    maker_fee DECIMAL(36, 18) NOT NULL DEFAULT 0,
    taker_fee DECIMAL(36, 18) NOT NULL DEFAULT 0,
    side VARCHAR(4) NOT NULL, -- BUY, SELL (taker side)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trades_market_id ON trades(market_id);
CREATE INDEX idx_trades_maker_order_id ON trades(maker_order_id);
CREATE INDEX idx_trades_taker_order_id ON trades(taker_order_id);
CREATE INDEX idx_trades_maker_user_id ON trades(maker_user_id);
CREATE INDEX idx_trades_taker_user_id ON trades(taker_user_id);
CREATE INDEX idx_trades_created_at ON trades(created_at DESC);

-- ======================
-- WALLET & DEPOSITS/WITHDRAWALS
-- ======================

CREATE TABLE deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_id UUID NOT NULL REFERENCES assets(id),
    amount DECIMAL(36, 18) NOT NULL,
    txid VARCHAR(255), -- blockchain transaction ID
    address VARCHAR(255), -- deposit address
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, CREDITED
    confirmations INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    credited_at TIMESTAMPTZ
);

CREATE INDEX idx_deposits_user_id ON deposits(user_id);
CREATE INDEX idx_deposits_asset_id ON deposits(asset_id);
CREATE INDEX idx_deposits_txid ON deposits(txid);
CREATE INDEX idx_deposits_status ON deposits(status);

CREATE TABLE withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    asset_id UUID NOT NULL REFERENCES assets(id),
    amount DECIMAL(36, 18) NOT NULL,
    fee DECIMAL(36, 18) NOT NULL DEFAULT 0,
    address VARCHAR(255) NOT NULL,
    txid VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, APPROVED, PROCESSING, SENT, REJECTED
    admin_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ
);

CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_asset_id ON withdrawals(asset_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_txid ON withdrawals(txid);

-- ======================
-- MARKET DATA & CANDLES
-- ======================

CREATE TABLE candles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES markets(id),
    interval VARCHAR(10) NOT NULL, -- 1m, 5m, 15m, 1h, 4h, 1d
    open_time TIMESTAMPTZ NOT NULL,
    close_time TIMESTAMPTZ NOT NULL,
    open_price DECIMAL(36, 18) NOT NULL,
    high_price DECIMAL(36, 18) NOT NULL,
    low_price DECIMAL(36, 18) NOT NULL,
    close_price DECIMAL(36, 18) NOT NULL,
    volume DECIMAL(36, 18) NOT NULL DEFAULT 0,
    quote_volume DECIMAL(36, 18) NOT NULL DEFAULT 0,
    trades_count INT NOT NULL DEFAULT 0,
    UNIQUE(market_id, interval, open_time)
);

CREATE INDEX idx_candles_market_id ON candles(market_id);
CREATE INDEX idx_candles_interval ON candles(interval);
CREATE INDEX idx_candles_open_time ON candles(open_time DESC);

-- ======================
-- ADMIN & REVENUE
-- ======================

CREATE TABLE exchange_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    amount DECIMAL(36, 18) NOT NULL,
    source VARCHAR(50) NOT NULL, -- TRADING_FEE, WITHDRAWAL_FEE
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_revenue_asset_id ON exchange_revenue(asset_id);
CREATE INDEX idx_revenue_created_at ON exchange_revenue(created_at DESC);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin_user_id ON audit_logs(admin_user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ======================
-- SEED DATA
-- ======================

-- Insert default assets
INSERT INTO assets (symbol, name, decimals) VALUES
('BTC', 'Bitcoin', 8),
('ETH', 'Ethereum', 18),
('USDT', 'Tether USD', 6),
('BNB', 'Binance Coin', 18),
('USDC', 'USD Coin', 6);

-- Insert default markets
INSERT INTO markets (base_asset_id, quote_asset_id, symbol, min_order_size, price_precision, quantity_precision)
SELECT 
    (SELECT id FROM assets WHERE symbol = 'BTC'),
    (SELECT id FROM assets WHERE symbol = 'USDT'),
    'BTC-USDT',
    0.0001,
    2,
    8
UNION ALL
SELECT 
    (SELECT id FROM assets WHERE symbol = 'ETH'),
    (SELECT id FROM assets WHERE symbol = 'USDT'),
    'ETH-USDT',
    0.001,
    2,
    8
UNION ALL
SELECT 
    (SELECT id FROM assets WHERE symbol = 'BNB'),
    (SELECT id FROM assets WHERE symbol = 'USDT'),
    'BNB-USDT',
    0.01,
    2,
    8;

-- Create admin user (password: Admin@123)
-- You should change this password immediately in production
INSERT INTO users (email, username, password_hash, role, kyc_status)
VALUES (
    'admin@bitprox.exchange',
    'admin',
    '$2b$10$K7jH8qZ9X2YvJ5mN3pL4.OqGzB1xT6wP8rF5sV3cE9nM2lK4hJ8yW', -- Admin@123
    'ADMIN',
    'VERIFIED'
);

COMMIT;