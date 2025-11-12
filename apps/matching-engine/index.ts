// apps/matching-engine/index.ts

/**
 * Matching Engine Service Entry Point
 * Implements order book, matching algorithm, and event notification skeleton
 */

import express from 'express';

const app = express();

app.use(express.json());

// Sample endpoint for submitting orders
app.post('/order', (req, res) => {
    // Matching logic to be implemented
    res.send({ status: 'received', order: req.body });
});

app.listen(4003, () => {
    console.log('Matching Engine Service running on port 4003');
});

export default app;
