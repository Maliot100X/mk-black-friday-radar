-- PHASE 5: DATABASE SYSTEM
-- MK Black Friday Radar - Complete PostgreSQL Schema

-- Enable PostGIS for geo queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STORES TABLE
CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_mk VARCHAR(255),
    name_al VARCHAR(255),
    slug VARCHAR(100) UNIQUE NOT NULL,
    website VARCHAR(500),
    logo_url VARCHAR(500),
    category VARCHAR(50), -- electronics, supermarket, marketplace
    address VARCHAR(500),
    city VARCHAR(100) DEFAULT 'Skopje',
    country VARCHAR(100) DEFAULT 'North Macedonia',
    phone VARCHAR(50),
    latitude FLOAT,
    longitude FLOAT,
    location GEOGRAPHY(POINT, 4326),
    is_active BOOLEAN DEFAULT TRUE,
    scraping_enabled BOOLEAN DEFAULT TRUE,
    last_scraped_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(50), -- electronics, fashion, appliances, supermarket
    subcategory VARCHAR(50),
    description TEXT,
    image_url VARCHAR(500),
    barcode VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DEALS TABLE
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    original_price_mkd FLOAT NOT NULL,
    discount_price_mkd FLOAT NOT NULL,
    discount_percentage FLOAT NOT NULL,
    deal_score FLOAT DEFAULT 0.0,
    currency VARCHAR(3) DEFAULT 'MKD',
    deal_url VARCHAR(1000),
    product_url VARCHAR(1000),
    is_hot BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    stock_status VARCHAR(20) DEFAULT 'in_stock',
    click_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating_average FLOAT DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    starts_at TIMESTAMP,
    ends_at TIMESTAMP,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    qr_code VARCHAR(100) UNIQUE,
    qr_code_data TEXT,
    preferred_categories JSONB DEFAULT '[]',
    preferred_stores JSONB DEFAULT '[]',
    language VARCHAR(10) DEFAULT 'mk',
    saved_deals_count INTEGER DEFAULT 0,
    used_deals_count INTEGER DEFAULT 0,
    total_savings_mkd FLOAT DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location GEOGRAPHY(POINT, 4326)
);

-- RATINGS TABLE
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, deal_id)
);

-- COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAVORITES TABLE
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, deal_id)
);

-- QR SCANS TABLE
CREATE TABLE IF NOT EXISTS qr_scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    qr_code VARCHAR(100) NOT NULL,
    scan_type VARCHAR(20) DEFAULT 'membership',
    latitude FLOAT,
    longitude FLOAT,
    location GEOGRAPHY(POINT, 4326),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PURCHASES TABLE
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    deal_id INTEGER REFERENCES deals(id) ON DELETE SET NULL,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    amount_mkd FLOAT NOT NULL,
    savings_mkd FLOAT DEFAULT 0.0,
    qr_code_used VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed',
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- click, search, view, purchase, scan, share
    deal_id INTEGER REFERENCES deals(id) ON DELETE SET NULL,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    search_query VARCHAR(500),
    metadata JSONB,
    session_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SCRAPER LOGS TABLE
CREATE TABLE IF NOT EXISTS scraper_logs (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    store_slug VARCHAR(100),
    status VARCHAR(20), -- success, error, partial
    items_scraped INTEGER DEFAULT 0,
    items_new INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50), -- deal_alert, price_drop, new_deal
    is_read BOOLEAN DEFAULT FALSE,
    deal_id INTEGER REFERENCES deals(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRICE HISTORY TABLE
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    price_mkd FLOAT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AGENT ACTIVITY LOG
CREATE TABLE IF NOT EXISTS agent_activities (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(100) NOT NULL,
    task_type VARCHAR(100),
    status VARCHAR(20),
    details JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_store ON deals(store_id, is_active);
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category, is_active);
CREATE INDEX IF NOT EXISTS idx_deals_hot ON deals(is_hot, discount_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_deals_score ON deals(deal_score DESC);
CREATE INDEX IF NOT EXISTS idx_deals_price ON deals(discount_price_mkd);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_qr_scans_user ON qr_scans(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_deals_location ON deals USING GIST(location);

-- Insert Macedonian stores
INSERT INTO stores (name, name_mk, slug, website, category, city, latitude, longitude) VALUES
('Neptun', 'Нептун', 'neptun', 'https://www.neptun.mk', 'electronics', 'Skopje', 42.0, 21.4),
('Setec', 'Сетек', 'setec', 'https://www.setec.mk', 'electronics', 'Skopje', 42.0, 21.4),
('Tehnomarket', 'Техномаркет', 'tehnomarket', 'https://www.tehnomarket.com.mk', 'appliances', 'Skopje', 42.0, 21.4),
('Anhoch', 'Анхоч', 'anhoch', 'https://www.anhoch.com', 'electronics', 'Skopje', 42.0, 21.4),
('Tinex', 'Тинекс', 'tinex', 'https://www.tinex.mk', 'supermarket', 'Skopje', 42.0, 21.4),
('Ramstore', 'Рамстор', 'ramstore', 'https://ramstore.com.mk', 'supermarket', 'Skopje', 42.0, 21.4),
('Vero', 'Веро', 'vero', 'https://vero.com.mk', 'supermarket', 'Skopje', 42.0, 21.4),
('KAM Market', 'КАМ Маркет', 'kam', 'https://kam.com.mk', 'supermarket', 'Skopje', 42.0, 21.4),
('Ananas', 'Ананас', 'ananas', 'https://www.ananas.mk', 'marketplace', 'Skopje', 42.0, 21.4),
('Zirafa', 'Жирафа', 'zirafa', 'https://www.zirafa.mk', 'marketplace', 'Skopje', 42.0, 21.4)
ON CONFLICT (slug) DO NOTHING;

-- Create function to calculate deal_score
CREATE OR REPLACE FUNCTION calculate_deal_score(
    discount_percent FLOAT,
    rating_avg FLOAT,
    click_count INTEGER
) RETURNS FLOAT AS $$
BEGIN
    RETURN (discount_percent * 0.6) + (COALESCE(rating_avg, 0) * 0.2) + (LEAST(click_count / 100.0, 20) * 0.2);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update deal_score
CREATE OR REPLACE FUNCTION update_deal_score() RETURNS TRIGGER AS $$
BEGIN
    NEW.deal_score := calculate_deal_score(
        NEW.discount_percentage,
        NEW.rating_average,
        NEW.click_count
    );
    NEW.is_hot := NEW.discount_percentage > 20;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_deal_score ON deals;
CREATE TRIGGER trigger_update_deal_score
    BEFORE INSERT OR UPDATE ON deals
    FOR EACH ROW
    EXECUTE FUNCTION update_deal_score();
