const https = require('https');
const fs = require('fs');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Magento GraphQL API URL
const magentoGraphQLURL = 'https://app.groceries-demo.test/graphql';

// SSL Options
const sslOptions = {
    key: fs.readFileSync('ssl/key.pem'), // Path to private key
    cert: fs.readFileSync('ssl/cert.pem'), // Path to certificate
  };


// Create an Express application

// Custom https.Agent to handle self-signed certificates
const agent = new https.Agent({
    rejectUnauthorized: false, // Disable certificate validation (use with caution)
  });

// Proxy middleware
app.use(
  '/graphql',
  createProxyMiddleware({
    target: magentoGraphQLURL, // Target Magento GraphQL API
    changeOrigin: true,        // Adjust the origin of the request to the target URL
    pathRewrite: {
      '^/graphql': '',         // Rewrite the path to forward requests
    },
    agent,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Forwarding request to: ${magentoGraphQLURL}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        let responseData = '';
        proxyRes.on('data', (chunk) => {
          responseData += chunk;
        });
        proxyRes.on('end', () => {
          console.log('Response from Magento GraphQL:', responseData);
  
          // Debugging: Check if response is valid JSON
          try {
            JSON.parse(responseData);
          } catch (err) {
            console.error('Invalid JSON response:', responseData);
          }
        });
      },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy error occurred');
    },
  })
);

// Start the server
// Start HTTPS server
https.createServer(sslOptions, app).listen(4000, () => {
    console.log('Proxy server running on https://magentoappproxy.test:4000');
  });