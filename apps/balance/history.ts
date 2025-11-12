// apps/balance/history.ts
/**
 * Ledger and balance history APIs for user/admin reconciliation
 */
import express from 'express';
import { getLedgerHistory } from './ledger';

export function addBalanceHistoryRoutes(app: express.Application) {
  // Fetch user's complete ledger history
  app.get('/history/ledger/:userId', async (req, res) => {
    const { userId } = req.params;
    const { currency } = req.query;
    const history = await getLedgerHistory(userId, currency as string | undefined);
    res.send(history);
  });
}
