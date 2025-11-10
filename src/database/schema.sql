-- Create database
CREATE DATABASE IF NOT EXISTS salla_returns CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE salla_returns;

-- Stores table (المتاجر المثبتة للتطبيق)
CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    store_id VARCHAR(255) UNIQUE NOT NULL,
    merchant_id VARCHAR(255) NOT NULL,
    store_name VARCHAR(255),
    store_email VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at DATETIME,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_store_id (store_id),
    INDEX idx_merchant_id (merchant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Return requests table (طلبات الاسترجاع)
CREATE TABLE IF NOT EXISTS return_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_number VARCHAR(50) UNIQUE NOT NULL,
    store_id VARCHAR(255) NOT NULL,
    order_id VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    iban VARCHAR(50) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('new', 'approved', 'rejected', 'refunded') DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_return_number (return_number),
    INDEX idx_store_id (store_id),
    INDEX idx_order_id (order_id),
    INDEX idx_customer_phone (customer_phone),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Return items table (المنتجات المسترجعة في كل طلب)
CREATE TABLE IF NOT EXISTS return_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_request_id INT NOT NULL,
    product_id VARCHAR(255),
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_return_request_id (return_request_id),
    FOREIGN KEY (return_request_id) REFERENCES return_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Webhooks log table (سجل الـ webhooks من سلة)
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event VARCHAR(255) NOT NULL,
    store_id VARCHAR(255),
    payload JSON,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event (event),
    INDEX idx_store_id (store_id),
    INDEX idx_processed (processed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Status history table (تاريخ تغيير حالات طلبات الاسترجاع)
CREATE TABLE IF NOT EXISTS return_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    return_request_id INT NOT NULL,
    old_status ENUM('new', 'approved', 'rejected', 'refunded'),
    new_status ENUM('new', 'approved', 'rejected', 'refunded') NOT NULL,
    changed_by VARCHAR(50) DEFAULT 'merchant',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_return_request_id (return_request_id),
    FOREIGN KEY (return_request_id) REFERENCES return_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
