import { pool } from '../database/connection.js';
import sallaService from '../services/sallaService.js';

/**
 * Generate unique return number
 */
function generateReturnNumber() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `RET-${timestamp}-${random}`.toUpperCase();
}

/**
 * Customer submits a return request
 * POST /api/returns/submit
 */
export async function submitReturnRequest(req, res) {
  const connection = await pool.getConnection();

  try {
    const {
      storeId,
      orderId,
      customerPhone,
      customerName,
      iban,
      bankName,
      reason
    } = req.body;

    // Validate required fields
    if (!storeId || !orderId || !customerPhone || !customerName || !iban || !bankName || !reason) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة'
      });
    }

    // Verify store exists and is active
    const [stores] = await connection.execute(
      'SELECT * FROM stores WHERE store_id = ? AND status = ?',
      [storeId, 'active']
    );

    if (stores.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المتجر غير موجود أو غير مفعل'
      });
    }

    // Verify order exists and belongs to customer
    const isValidOrder = await sallaService.verifyOrderOwnership(storeId, orderId, customerPhone);

    if (!isValidOrder) {
      return res.status(403).json({
        success: false,
        message: 'رقم الطلب أو رقم الجوال غير صحيح'
      });
    }

    // Get order details
    const order = await sallaService.getOrder(storeId, orderId);

    await connection.beginTransaction();

    // Generate return number
    const returnNumber = generateReturnNumber();

    // Insert return request
    const [result] = await connection.execute(
      `INSERT INTO return_requests
       (return_number, store_id, order_id, customer_phone, customer_name, iban, bank_name, reason, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [returnNumber, storeId, orderId, customerPhone, customerName, iban, bankName, reason, 'new']
    );

    const returnRequestId = result.insertId;

    // Insert return items from order
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await connection.execute(
          `INSERT INTO return_items
           (return_request_id, product_id, product_name, quantity, price)
           VALUES (?, ?, ?, ?, ?)`,
          [returnRequestId, item.id, item.name, item.quantity, item.price]
        );
      }
    }

    // Add status history
    await connection.execute(
      `INSERT INTO return_status_history
       (return_request_id, old_status, new_status, changed_by, notes)
       VALUES (?, NULL, ?, ?, ?)`,
      [returnRequestId, 'new', 'customer', 'تم إنشاء طلب الاسترجاع']
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب الاسترجاع بنجاح',
      data: {
        returnNumber,
        returnRequestId
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error submitting return request:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إرسال الطلب',
      error: error.message
    });
  } finally {
    connection.release();
  }
}

/**
 * Get return request by return number (for customer tracking)
 * GET /api/returns/track/:returnNumber
 */
export async function trackReturn(req, res) {
  try {
    const { returnNumber } = req.params;

    const [rows] = await pool.execute(
      `SELECT
        rr.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'product_name', ri.product_name,
            'quantity', ri.quantity,
            'price', ri.price
          )
        ) as items
       FROM return_requests rr
       LEFT JOIN return_items ri ON rr.id = ri.return_request_id
       WHERE rr.return_number = ?
       GROUP BY rr.id`,
      [returnNumber]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'طلب الاسترجاع غير موجود'
      });
    }

    const returnRequest = rows[0];
    returnRequest.items = returnRequest.items ? JSON.parse(`[${returnRequest.items}]`) : [];

    res.json({
      success: true,
      data: returnRequest
    });

  } catch (error) {
    console.error('Error tracking return:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء البحث عن الطلب',
      error: error.message
    });
  }
}

/**
 * Get all return requests for a store (merchant dashboard)
 * GET /api/merchant/returns
 */
export async function getMerchantReturns(req, res) {
  try {
    const { storeId } = req.query;
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }

    let query = `
      SELECT
        rr.*,
        COUNT(ri.id) as items_count,
        SUM(ri.quantity) as total_quantity
      FROM return_requests rr
      LEFT JOIN return_items ri ON rr.id = ri.return_request_id
      WHERE rr.store_id = ?
    `;

    const params = [storeId];

    // Filter by status
    if (status) {
      query += ' AND rr.status = ?';
      params.push(status);
    }

    // Filter by date range
    if (startDate) {
      query += ' AND DATE(rr.created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(rr.created_at) <= ?';
      params.push(endDate);
    }

    query += ' GROUP BY rr.id ORDER BY rr.created_at DESC';

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM return_requests WHERE store_id = ?';
    const countParams = [storeId];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (startDate) {
      countQuery += ' AND DATE(created_at) >= ?';
      countParams.push(startDate);
    }

    if (endDate) {
      countQuery += ' AND DATE(created_at) <= ?';
      countParams.push(endDate);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error getting merchant returns:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching returns',
      error: error.message
    });
  }
}

/**
 * Get single return request details (merchant)
 * GET /api/merchant/returns/:id
 */
export async function getReturnDetails(req, res) {
  try {
    const { id } = req.params;
    const { storeId } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }

    // Get return request
    const [rows] = await pool.execute(
      'SELECT * FROM return_requests WHERE id = ? AND store_id = ?',
      [id, storeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    const returnRequest = rows[0];

    // Get items
    const [items] = await pool.execute(
      'SELECT * FROM return_items WHERE return_request_id = ?',
      [id]
    );

    // Get status history
    const [history] = await pool.execute(
      'SELECT * FROM return_status_history WHERE return_request_id = ? ORDER BY created_at DESC',
      [id]
    );

    returnRequest.items = items;
    returnRequest.history = history;

    res.json({
      success: true,
      data: returnRequest
    });

  } catch (error) {
    console.error('Error getting return details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching return details',
      error: error.message
    });
  }
}

/**
 * Update return request status (merchant)
 * PUT /api/merchant/returns/:id/status
 */
export async function updateReturnStatus(req, res) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { storeId, status, notes } = req.body;

    if (!storeId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Store ID and status are required'
      });
    }

    // Validate status
    const validStatuses = ['new', 'approved', 'rejected', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Get current return request
    const [rows] = await connection.execute(
      'SELECT * FROM return_requests WHERE id = ? AND store_id = ?',
      [id, storeId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Return request not found'
      });
    }

    const returnRequest = rows[0];
    const oldStatus = returnRequest.status;

    await connection.beginTransaction();

    // Update status
    await connection.execute(
      'UPDATE return_requests SET status = ?, notes = ? WHERE id = ?',
      [status, notes || null, id]
    );

    // Add to history
    await connection.execute(
      `INSERT INTO return_status_history
       (return_request_id, old_status, new_status, changed_by, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [id, oldStatus, status, 'merchant', notes || null]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating return status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message
    });
  } finally {
    connection.release();
  }
}

/**
 * Get return statistics for merchant dashboard
 * GET /api/merchant/returns/stats
 */
export async function getReturnStats(req, res) {
  try {
    const { storeId } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }

    // Get counts by status
    const [statusCounts] = await pool.execute(
      `SELECT
        status,
        COUNT(*) as count
       FROM return_requests
       WHERE store_id = ?
       GROUP BY status`,
      [storeId]
    );

    // Get total returns
    const [totalResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM return_requests WHERE store_id = ?',
      [storeId]
    );

    // Get recent returns (last 7 days)
    const [recentResult] = await pool.execute(
      `SELECT COUNT(*) as count
       FROM return_requests
       WHERE store_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      [storeId]
    );

    res.json({
      success: true,
      data: {
        total: totalResult[0].total,
        recent: recentResult[0].count,
        byStatus: statusCounts
      }
    });

  } catch (error) {
    console.error('Error getting return stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
}
