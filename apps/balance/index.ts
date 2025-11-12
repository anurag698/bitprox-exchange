// Update apps/balance/index.ts to add ledger/history routes
import express from 'express';
import { getBalances } from './db';
import { addBalanceHistoryRoutes } from './history';

const app = express();
app.use(express.json());

app.get('/balances/:userId', async (req, res) => {
  const balances = await getBalances(req.params.userId);
  res.send({ userId: req.params.userId, balances });
});

addBalanceHistoryRoutes(app);

app.post('/transfer', (req, res) => {
  const { fromUserId, toUserId, amount, currency } = req.body;
  // TODO: Validate and transfer funds, ledger integration
  res.send({ status: 'transfer received', fromUserId, toUserId, amount, currency });
});

app.listen(4002, () => {
  console.log('Balance Service running on port 4002');
});

export default app;
