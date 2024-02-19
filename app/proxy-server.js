const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Define your proxy route
app.use('/api', createProxyMiddleware({
    target: 'https://www.thebluealliance.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api/v3' 
    },
    headers: {
        'h2zoQFRZDrANaEitRZzA0pZfM3kiUqGaNMqmh49un8KFUB27GnbAphMc9VLmDYD5': process.env.BLUEALLIANCE_API_KEY 
    }
})); // Add closing parenthesis and comma here

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Proxy Server listening on port ${PORT}`);
});
