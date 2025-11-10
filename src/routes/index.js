import express from 'express';
import {
  submitReturnRequest,
  trackReturn,
  getMerchantReturns,
  getReturnDetails,
  updateReturnStatus,
  getReturnStats
} from '../controllers/returnController.js';
import {
  handleSallaWebhook,
  testWebhook
} from '../controllers/webhookController.js';

const router = express.Router();

// ============================================
// Customer Routes (العملاء)
// ============================================

// Submit return request
router.post('/returns/submit', submitReturnRequest);

// Track return by return number
router.get('/returns/track/:returnNumber', trackReturn);

// ============================================
// Merchant Routes (التجار)
// ============================================

// Get all returns for a store
router.get('/merchant/returns', getMerchantReturns);

// Get return statistics
router.get('/merchant/returns/stats', getReturnStats);

// Get specific return details
router.get('/merchant/returns/:id', getReturnDetails);

// Update return status
router.put('/merchant/returns/:id/status', updateReturnStatus);

// ============================================
// Webhook Routes
// ============================================

// Salla webhook handler
router.post('/webhook/salla', handleSallaWebhook);

// Test webhook endpoint
router.get('/webhook/salla/test', testWebhook);

// ============================================
// Health Check
// ============================================

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Salla Returns Management API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
