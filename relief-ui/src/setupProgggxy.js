// relief-ui/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Forward any request that starts with /interviews to port 3000
  app.use(
    '/interviews',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
  // If you also need /candidates, /employees, /audit_logs, etc.:
  app.use(
    ['/candidates','/employees','/audit_logs'],
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};
