import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './database/connection.js';
import routes from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// Middleware
// ============================================

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'https://bhgxx.sa',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files
app.use('/customer', express.static(path.join(__dirname, '../public/customer')));
app.use('/merchant', express.static(path.join(__dirname, '../public/merchant')));

// ============================================
// Routes
// ============================================

app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Salla Returns Management System API',
    version: '1.0.0',
    pages: {
      customer: '/customer/',
      merchant: '/merchant/'
    },
    endpoints: {
      health: '/api/health',
      customer: {
        submitReturn: 'POST /api/returns/submit',
        trackReturn: 'GET /api/returns/track/:returnNumber'
      },
      merchant: {
        getReturns: 'GET /api/merchant/returns',
        getStats: 'GET /api/merchant/returns/stats',
        getDetails: 'GET /api/merchant/returns/:id',
        updateStatus: 'PUT /api/merchant/returns/:id/status'
      },
      webhook: {
        salla: 'POST /api/webhook/salla',
        test: 'GET /api/webhook/salla/test'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// Start Server
// ============================================

async function startServer() {
  try {
    // Test database connection
    await testConnection();

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ============================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
      console.log(`🚀 Base URL: ${process.env.BASE_URL}`);
      console.log('🚀 ============================================');
      console.log('');
      console.log('📋 Available endpoints:');
      console.log(`   - Health: http://localhost:${PORT}/api/health`);
      console.log(`   - Webhook: ${process.env.BASE_URL}/api/webhook/salla`);
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
