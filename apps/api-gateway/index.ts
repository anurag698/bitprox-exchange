// apps/api-gateway/index.ts

/**
 * API Gateway Service Entry Point
 * Centralizes routing and request aggregation across all microservices
 */

import express from 'express';

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.send({ status: 'API Gateway OK' });
});

// Proxy endpoint skeleton (implement microservice proxies here)
// app.use('/auth', ...)
// app.use('/balance', ...)

app.listen(4000, () => {
    console.log('API Gateway Service running on port 4000');
});

export default app;
