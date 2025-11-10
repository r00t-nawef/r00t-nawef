import axios from 'axios';
import dotenv from 'dotenv';
import { pool } from '../database/connection.js';

dotenv.config();

class SallaService {
  constructor() {
    this.apiUrl = process.env.SALLA_API_URL || 'https://api.salla.dev';
    this.clientId = process.env.SALLA_CLIENT_ID;
    this.clientSecret = process.env.SALLA_CLIENT_SECRET;
  }

  /**
   * Get access token for a store
   */
  async getAccessToken(storeId) {
    try {
      const [rows] = await pool.execute(
        'SELECT access_token, refresh_token, token_expires_at FROM stores WHERE store_id = ?',
        [storeId]
      );

      if (rows.length === 0) {
        throw new Error('Store not found');
      }

      const store = rows[0];
      const now = new Date();
      const expiresAt = new Date(store.token_expires_at);

      // Check if token is expired
      if (expiresAt <= now) {
        // Refresh token
        return await this.refreshAccessToken(storeId, store.refresh_token);
      }

      return store.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(storeId, refreshToken) {
    try {
      const response = await axios.post(`${this.apiUrl}/oauth2/token`, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret
      });

      const { access_token, refresh_token, expires_in } = response.data;
      const expiresAt = new Date(Date.now() + expires_in * 1000);

      // Update tokens in database
      await pool.execute(
        'UPDATE stores SET access_token = ?, refresh_token = ?, token_expires_at = ? WHERE store_id = ?',
        [access_token, refresh_token, expiresAt, storeId]
      );

      return access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  /**
   * Get order details from Salla
   */
  async getOrder(storeId, orderId) {
    try {
      const accessToken = await this.getAccessToken(storeId);

      const response = await axios.get(`${this.apiUrl}/admin/v2/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error getting order from Salla:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update order status in Salla
   */
  async updateOrderStatus(storeId, orderId, status) {
    try {
      const accessToken = await this.getAccessToken(storeId);

      const response = await axios.put(
        `${this.apiUrl}/admin/v2/orders/${orderId}/status`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Search orders by customer phone
   */
  async searchOrdersByPhone(storeId, phone) {
    try {
      const accessToken = await this.getAccessToken(storeId);

      const response = await axios.get(`${this.apiUrl}/admin/v2/orders`, {
        params: {
          'filter[customer.mobile]': phone
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error searching orders:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verify order belongs to customer
   */
  async verifyOrderOwnership(storeId, orderId, customerPhone) {
    try {
      const order = await this.getOrder(storeId, orderId);

      // Clean phone numbers for comparison
      const cleanOrderPhone = order.customer?.mobile?.replace(/\D/g, '');
      const cleanInputPhone = customerPhone.replace(/\D/g, '');

      return cleanOrderPhone === cleanInputPhone;
    } catch (error) {
      console.error('Error verifying order ownership:', error);
      return false;
    }
  }
}

export default new SallaService();
