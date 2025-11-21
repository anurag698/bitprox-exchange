# 🚀 BitProX - Professional Cryptocurrency Exchange

> A production-ready, Binance-like centralized cryptocurrency exchange built with modern microservices architecture.

## ⚡ Features

### Trading Engine
- ✅ **Spot Trading** - LIMIT and MARKET orders
- ✅ **Price-Time Priority Matching** - Fair order execution
- ✅ **Real-time Orderbook** - WebSocket live updates
- ✅ **Multiple Trading Pairs** - BTC/USDT, ETH/USDT, BNB/USDT
- ✅ **Maker/Taker Fees** - Configurable fee structure

### User Management
- ✅ **JWT Authentication** - Secure login with refresh tokens
- ✅ **KYC System** - User verification workflow
- ✅ **Role-Based Access** - USER and ADMIN roles
- ✅ **Referral System** - User referral tracking

### Wallet & Transfers
- ✅ **Multi-Asset Wallets** - BTC, ETH, USDT, BNB, USDC
- ✅ **Deposit/Withdrawal** - Blockchain transaction tracking
- ✅ **Dual-Entry Ledger** - Available and locked balances
- ✅ **Complete Audit Trail** - All balance changes logged

### Market Data
- ✅ **OHLCV Candles** - 1m, 5m, 15m, 1h, 4h, 1d intervals
- ✅ **Trade History** - Complete trade records
- ✅ **24h Ticker** - Volume, high, low, change statistics

### Admin Panel
- ✅ **Market Management** - Create/edit trading pairs
- ✅ **User Management** - Freeze/unfreeze accounts
- ✅ **Withdrawal Approval** - Manual withdrawal review
- ✅ **Revenue Tracking** - Fee collection analytics
- ✅ **Audit Logs** - All admin actions logged

## 🏗️ Architecture

### Microservices

```
┌─────────────────┐
│  Web Frontend   │ :3000
│  Admin Frontend │ :3001
└────────┬────────┘
         │
    ┌────▼─────┐
    │ API      │ :4000
    │ Gateway  │
    └────┬─────┘
         │
    ┌────┴──────────────────────────────────┐
    │                                        │
┌───▼────┐  ┌────────┐  ┌─────────┐  ┌─────▼────┐
│ Auth   │  │Balance │  │Matching │  │Market    │
│Service │  │Service │  │Engine   │  │Data      │
│:4001   │  │:4002   │  │:4003    │  │:4004     │
└────────┘  └────────┘  └─────────┘  └──────────┘

┌────────┐  ┌────────┐
│Wallet  │  │Admin   │
│Service │  │Service │
│:4005   │  │:4006   │
└────────┘  └────────┘

    ┌────────────┐      ┌───────┐
    │ PostgreSQL │      │ Redis │
    │   :5432    │      │ :6379 │
    └────────────┘      └───────┘
```

### Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- PostgreSQL 15
- Redis 7
- WebSocket (Socket.io)

**Frontend:**
- React 18
- Next.js
- Tailwind CSS
- TradingView Charts

**DevOps:**
- Docker & Docker Compose
- GitHub Actions (CI/CD ready)

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/anurag698/bitprox-exchange.git
cd bitprox-exchange

# Start all services with Docker
docker-compose up -d

# Check service status
docker-compose ps
```

### Access Points

- **Trading UI**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **API Gateway**: http://localhost:4000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Default Credentials

**Admin Account:**
- Email: `admin@bitprox.exchange`
- Password: `Admin@123`

⚠️ **IMPORTANT**: Change the admin password immediately in production!

## 📁 Project Structure

```
bitprox-exchange/
├── apps/
│   ├── api-gateway/          # Routes all traffic
│   ├── auth-service/         # Authentication & JWT
│   ├── balance-service/      # Balance management
│   ├── matching-engine/      # Order matching logic
│   ├── market-data-service/  # Candles & tickers
│   ├── wallet-service/       # Deposits & withdrawals
│   ├── admin-service/        # Admin operations
│   ├── web-frontend/         # User trading UI
│   └── admin-frontend/       # Admin dashboard
├── packages/
│   ├── common/              # Shared types & utilities
│   └── config/              # Environment configs
├── database/
│   └── init.sql             # Database schema
├── docker-compose.yml       # Service orchestration
└── README.md
```

## 🔧 Development

### Local Development (without Docker)

```bash
# Install dependencies for all services
npm install

# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# Run auth service
cd apps/auth-service
npm run dev

# Run other services in separate terminals...
```

### Environment Variables

Create `.env` files in each service directory. See `.env.example` for templates.

```env
NODE_ENV=development
PORT=4001
DATABASE_URL=postgresql://bitprox:password@localhost:5432/bitprox_exchange
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

## 📊 Database Schema

The database includes:

- **Users & Sessions** - Authentication and session management
- **Assets & Markets** - Tradable assets and trading pairs
- **Balances & Ledger** - User balances with complete audit trail
- **Orders & Trades** - Order management and trade execution
- **Deposits & Withdrawals** - Wallet operations
- **Candles** - OHLCV data for charts
- **Revenue & Audit Logs** - Admin tracking

See `database/init.sql` for the complete schema.

## 🔐 Security Features

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Authentication** - Access + refresh token pattern
- ✅ **Role-Based Access Control** - USER/ADMIN permissions
- ✅ **Session Management** - Track and revoke sessions
- ✅ **Audit Logging** - All admin actions logged
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Protection** - Parameterized queries

## 📈 API Documentation

### Authentication

```http
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
```

### Trading

```http
GET  /api/markets
GET  /api/markets/:symbol/orderbook
POST /api/orders
GET  /api/orders/open
GET  /api/orders/history
DELETE /api/orders/:id
```

### Wallet

```http
GET  /api/balances
POST /api/wallet/deposit
POST /api/wallet/withdraw
GET  /api/wallet/history
```

### Market Data

```http
GET  /api/markets/:symbol/candles
GET  /api/markets/:symbol/trades
GET  /api/markets/:symbol/ticker
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Test coverage
npm run test:coverage
```

## 📦 Deployment

### Production Checklist

- [ ] Change all default passwords
- [ ] Update JWT secrets
- [ ] Configure environment variables
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Enable production logging
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure backup strategy
- [ ] Review security settings

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start in production mode
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Binance, OKX, and other leading crypto exchanges
- Built with modern best practices for scalability and security
- Community feedback and contributions

## 📧 Support

For questions and support:
- GitHub Issues: [Report a bug](https://github.com/anurag698/bitprox-exchange/issues)
- Email: admin@bitprox.exchange

## Using GitHub Copilot in Codespaces

This repository includes a devcontainer configuration that installs GitHub Copilot extensions automatically when you open a Codespace.

Steps to use Copilot in a Codespace:

1. Open this repository in GitHub Codespaces (Code → Open with Codespaces → New codespace).
2. After the Codespace starts the devcontainer, the GitHub Copilot and Copilot Chat extensions will be installed automatically.
3. Sign in to GitHub if prompted and enable Copilot (a subscription or organization seat may be required).
4. Use the Copilot panel (on the left or via View → Command Palette → Copilot) to ask natural-language commands. Note: Copilot Chat can provide code, suggest commands, and — when permitted — run or suggest terminal commands you can copy or execute.

If you prefer to run locally in VS Code, the repository includes a VS Code recommendation file (.vscode/extensions.json) to suggest installing the Copilot extensions.

---

**⚠️ Disclaimer**: This is a demonstration project. Use at your own risk. Always conduct thorough security audits before deploying to production with real funds.

**Built with ❤️ by the BitProX Team**