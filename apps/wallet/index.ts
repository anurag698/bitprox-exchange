// apps/wallet/index.ts
/**
 * Wallet Microservice Entry Point
 * Supports deposit/withdraw endpoints, ready for business logic
 */
import express from 'express';

const app = express();
app.use(express.json());

// Deposit endpoint: expects { userId, amount, currency }
app.post('/deposit', (req, res) => {
  const { userId, amount, currency } = req.body;
  // TODO: validate user, handle transaction, integrate with balance
  res.send({ status: 'deposit received', userId, amount, currency });
});

// Withdrawal endpoint: expects { userId, amount, currency, address }
app.post('/withdraw', (req, res) => {
  const { userId, amount, currency, address } = req.body;
  // TODO: validate user, check balance, create withdrawal transaction, broadcast
  res.send({ status: 'withdrawal received', userId, amount, currency, address });
});

app.listen(4005, () => {
  console.log('Wallet Service running on port 4005');
});

export default app;
