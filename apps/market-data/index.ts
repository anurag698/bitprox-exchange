// apps/market-data/index.ts
/**
 * Market Data Microservice Entry Point
 * Provides endpoints for real-time price/ticker data for trading pairs
 */
import express from 'express';

const app = express();
app.use(express.json());

// Endpoint for ticker (simulate response, ready for external API)
app.get('/ticker/:pair', (req, res) => {
  // TODO: Integrate with external/internal sources for real-time ticker pricing
  res.send({ pair: req.params.pair, price: Math.random() * 10000, ts: Date.now() });
});

// Endpoint for OHLCV (candles)
app.get('/ohlcv/:pair', (req, res) => {
  // TODO: Supply latest OHLCV data
  res.send({ pair: req.params.pair, ohlcv: [] });
});

app.listen(4004, () => {
  console.log('Market Data Service running on port 4004');
});

export default app;
