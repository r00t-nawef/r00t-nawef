import crypto from 'crypto';
import { pool } from '../database/connection.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Verify webhook signature from Salla
 */
function verifyWebhookSignature(payload, signature) {
  const secret = process.env.SALLA_WEBHOOK_SECRET;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return hash === signature;
}

/**
 * Handle Salla webhooks
 * POST /webhook/salla
 */
export async function handleSallaWebhook(req, res) {
  const connection = await pool.getConnection();

  try {
    const payload = req.body;
    const signature = req.headers['x-salla-signature'];

    // Verify signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const { event, merchant, data } = payload;

    console.log(`📨 Received webhook: ${event}`);

    // Log webhook
    await connection.execute(
      'INSERT INTO webhook_logs (event, store_id, payload, processed) VALUES (?, ?, ?, ?)',
      [event, merchant, JSON.stringify(payload), false]
    );

    // Handle different webhook events
    switch (event) {
      case 'app.store.authorize':
        await handleStoreAuthorize(connection, payload);
        break;

      case 'app.store.token':
        await handleStoreToken(connection, payload);
        break;

      case 'order.created':
        console.log('Order created:', data?.id);
        break;

      case 'order.updated':
        console.log('Order updated:', data?.id);
        break;

      case 'order.cancelled':
        console.log('Order cancelled:', data?.id);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    // Mark as processed
    await connection.execute(
      'UPDATE webhook_logs SET processed = TRUE WHERE event = ? AND store_id = ? ORDER BY created_at DESC LIMIT 1',
      [event, merchant]
    );

    res.json({
      success: true,
      message: 'Webhook processed'
    });

  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing webhook',
      error: error.message
    });
  } finally {
    connection.release();
  }
}

/**
 * Handle app.store.authorize event
 * This event is triggered when a merchant installs the app
 */
async function handleStoreAuthorize(connection, payload) {
  try {
    const { merchant, data } = payload;
    const { access_token, refresh_token, expires_in } = data;

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Check if store exists
    const [existingStores] = await connection.execute(
      'SELECT id FROM stores WHERE store_id = ?',
      [merchant]
    );

    if (existingStores.length > 0) {
      // Update existing store
      await connection.execute(
        `UPDATE stores
         SET access_token = ?, refresh_token = ?, token_expires_at = ?, status = ?, updated_at = NOW()
         WHERE store_id = ?`,
        [access_token, refresh_token, expiresAt, 'active', merchant]
      );

      console.log(`✅ Store ${merchant} updated`);
    } else {
      // Insert new store
      await connection.execute(
        `INSERT INTO stores
         (store_id, merchant_id, access_token, refresh_token, token_expires_at, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [merchant, merchant, access_token, refresh_token, expiresAt, 'active']
      );

      console.log(`✅ New store ${merchant} authorized`);
    }

  } catch (error) {
    console.error('Error handling store authorize:', error);
    throw error;
  }
}

/**
 * Handle app.store.token event
 * This event provides updated tokens
 */
async function handleStoreToken(connection, payload) {
  try {
    const { merchant, data } = payload;
    const { access_token, refresh_token, expires_in } = data;

    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await connection.execute(
      `UPDATE stores
       SET access_token = ?, refresh_token = ?, token_expires_at = ?, updated_at = NOW()
       WHERE store_id = ?`,
      [access_token, refresh_token, expiresAt, merchant]
    );

    console.log(`✅ Tokens updated for store ${merchant}`);

  } catch (error) {
    console.error('Error handling store token:', error);
    throw error;
  }
}

/**
 * Test endpoint to verify webhook is accessible
 * GET /webhook/salla/test
 */
export function testWebhook(req, res) {
  res.json({
    success: true,
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString()
  });
}
