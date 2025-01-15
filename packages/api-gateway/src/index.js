const express = require('express');
const httpProxy = require('http-proxy-middleware');

const app = express();

// Route for /auth to auth-service
app.use('/api/auth', httpProxy.createProxyMiddleware({
    target: 'http://localhost:4000/api/auth/',  // Assuming auth-service is running on port 5000
    changeOrigin: true,
}));

// Route for /transaction to transaction-service
app.use('/api/transactions', httpProxy.createProxyMiddleware({
    target: 'http://localhost:5001/api/transactions/',  // Assuming transaction-service is running on port 5001
    changeOrigin: true,
}));

// Example: add more routes for other services
// app.use('/serviceX', ...);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
