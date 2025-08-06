-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users Table (Simple authentication)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  
  -- Default addresses
  billing_address JSONB,
  shipping_address JSONB,
  
  -- Preferences
  email_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Product Info
  name VARCHAR(255) NOT NULL,
  model VARCHAR(100),
  sku VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(100), -- Simple string category
  
  -- Pricing & Availability
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2), -- Your cost (private)
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Product Details
  description TEXT,
  short_description VARCHAR(500),
  specifications JSONB DEFAULT '{}', -- Flexible specifications as JSONB
  
  -- Media
  thumbnail_image VARCHAR(500), -- Main thumbnail image for cards/listings
  images TEXT[] DEFAULT '{}', -- Array of additional product images
  
  -- SEO & Marketing
  slug VARCHAR(255) UNIQUE,
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Business Info
  weight_kg DECIMAL(8,2),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add search vector column separately to avoid immutability issues
ALTER TABLE products ADD COLUMN search_vector TSVECTOR;

-- Cart System
CREATE TABLE carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT cart_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  )
);

CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(cart_id, product_id)
);

-- Orders System
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Customer Info
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  
  -- Addresses
  billing_address JSONB NOT NULL,
  shipping_address JSONB,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  
  -- Payment
  payment_method VARCHAR(100),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  product_sku VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscriptions
CREATE TABLE newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Contact Messages
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock_quantity);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_specifications ON products USING GIN(specifications);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_active ON newsletter_subscriptions(is_active);

CREATE INDEX idx_contact_read ON contact_messages(is_read);
CREATE INDEX idx_contact_created ON contact_messages(created_at);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' || 
    COALESCE(NEW.model, '') || ' ' || 
    COALESCE(NEW.category, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.specifications::text, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
CREATE TRIGGER update_products_search_vector 
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

-- Enhanced Cart Management Functions

-- Get or create cart for both logged-in users and anonymous sessions
CREATE OR REPLACE FUNCTION get_or_create_cart(p_user_id UUID, p_session_id VARCHAR)
RETURNS UUID AS $$
DECLARE
  cart_id UUID;
BEGIN
  -- Try to find existing cart
  SELECT id INTO cart_id FROM carts 
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);
  
  -- Create new cart if not found
  IF cart_id IS NULL THEN
    INSERT INTO carts (user_id, session_id)
    VALUES (p_user_id, p_session_id)
    RETURNING id INTO cart_id;
  END IF;
  
  RETURN cart_id;
END;
$$ LANGUAGE plpgsql;

-- Add item to cart (handles both user and session carts)
CREATE OR REPLACE FUNCTION add_to_cart(
  p_user_id UUID, 
  p_session_id VARCHAR, 
  p_product_id UUID, 
  p_quantity INTEGER,
  p_price DECIMAL(10,2)
)
RETURNS JSONB AS $$
DECLARE
  v_cart_id UUID;
  v_existing_quantity INTEGER := 0;
  v_new_quantity INTEGER;
  v_product_name VARCHAR(255);
  v_stock_quantity INTEGER;
  result JSONB;
BEGIN
  -- Validate product exists and get stock info
  SELECT name, stock_quantity INTO v_product_name, v_stock_quantity
  FROM products 
  WHERE id = p_product_id AND is_active = true;
  
  IF v_product_name IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Product not found or inactive'
    );
  END IF;
  
  -- Get or create cart
  v_cart_id := get_or_create_cart(p_user_id, p_session_id);
  
  -- Check if item already exists in cart
  SELECT quantity INTO v_existing_quantity 
  FROM cart_items 
  WHERE cart_id = v_cart_id AND product_id = p_product_id;
  
  -- Calculate new quantity
  v_new_quantity := COALESCE(v_existing_quantity, 0) + p_quantity;
  
  -- Check if we have enough stock
  IF v_new_quantity > v_stock_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stock',
      'available_stock', v_stock_quantity,
      'requested_quantity', v_new_quantity
    );
  END IF;
  
  -- Insert or update cart item
  INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time)
  VALUES (v_cart_id, p_product_id, v_new_quantity, p_price)
  ON CONFLICT (cart_id, product_id) 
  DO UPDATE SET 
    quantity = v_new_quantity,
    price_at_time = p_price,
    updated_at = NOW();
  
  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'cart_id', v_cart_id,
    'product_id', p_product_id,
    'product_name', v_product_name,
    'quantity', v_new_quantity,
    'price', p_price,
    'total_price', v_new_quantity * p_price
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', 'Database error: ' || SQLERRM
  );
END;
$$ LANGUAGE plpgsql;

-- Update cart item quantity
CREATE OR REPLACE FUNCTION update_cart_item(
  p_user_id UUID,
  p_session_id VARCHAR,
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_cart_id UUID;
  v_stock_quantity INTEGER;
  v_product_name VARCHAR(255);
  result JSONB;
BEGIN
  -- Get cart
  SELECT id INTO v_cart_id FROM carts 
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);
  
  IF v_cart_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cart not found');
  END IF;
  
  -- Get product info
  SELECT name, stock_quantity INTO v_product_name, v_stock_quantity
  FROM products WHERE id = p_product_id;
  
  -- Check stock
  IF p_quantity > v_stock_quantity THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Insufficient stock',
      'available_stock', v_stock_quantity
    );
  END IF;
  
  -- Remove item if quantity is 0 or less
  IF p_quantity <= 0 THEN
    DELETE FROM cart_items 
    WHERE cart_id = v_cart_id AND product_id = p_product_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'action', 'removed',
      'product_id', p_product_id
    );
  END IF;
  
  -- Update quantity
  UPDATE cart_items 
  SET quantity = p_quantity, updated_at = NOW()
  WHERE cart_id = v_cart_id AND product_id = p_product_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Item not in cart');
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'action', 'updated',
    'product_id', p_product_id,
    'quantity', p_quantity
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Remove item from cart
CREATE OR REPLACE FUNCTION remove_from_cart(
  p_user_id UUID,
  p_session_id VARCHAR,
  p_product_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_cart_id UUID;
BEGIN
  -- Get cart
  SELECT id INTO v_cart_id FROM carts 
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);
  
  IF v_cart_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cart not found');
  END IF;
  
  -- Remove item
  DELETE FROM cart_items 
  WHERE cart_id = v_cart_id AND product_id = p_product_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Item not in cart');
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'product_id', p_product_id,
    'message', 'Item removed from cart'
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Get cart with items (for both logged-in users and sessions)
CREATE OR REPLACE FUNCTION get_cart_with_items(p_user_id UUID, p_session_id VARCHAR)
RETURNS JSONB AS $$
DECLARE
  v_cart_id UUID;
  result JSONB;
BEGIN
  -- Get cart
  SELECT id INTO v_cart_id FROM carts 
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);
  
  IF v_cart_id IS NULL THEN
    RETURN jsonb_build_object(
      'cart_id', null,
      'items', '[]'::jsonb,
      'total_items', 0,
      'total_amount', 0
    );
  END IF;
  
  -- Get cart items with product details
  SELECT jsonb_build_object(
    'cart_id', v_cart_id,
    'items', COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', ci.id,
        'product_id', ci.product_id,
        'quantity', ci.quantity,
        'price_at_time', ci.price_at_time,
        'total_price', ci.quantity * ci.price_at_time,
        'product', jsonb_build_object(
          'name', p.name,
          'sku', p.sku,
          'thumbnail_image', p.thumbnail_image,
          'current_price', p.price,
          'stock_quantity', p.stock_quantity
        )
      )
    ), '[]'::jsonb),
    'total_items', COALESCE(SUM(ci.quantity), 0),
    'total_amount', COALESCE(SUM(ci.quantity * ci.price_at_time), 0)
  ) INTO result
  FROM cart_items ci
  JOIN products p ON ci.product_id = p.id
  WHERE ci.cart_id = v_cart_id;
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Clear cart
CREATE OR REPLACE FUNCTION clear_cart(p_user_id UUID, p_session_id VARCHAR)
RETURNS JSONB AS $$
DECLARE
  v_cart_id UUID;
BEGIN
  -- Get cart
  SELECT id INTO v_cart_id FROM carts 
  WHERE (p_user_id IS NOT NULL AND user_id = p_user_id) 
     OR (p_session_id IS NOT NULL AND session_id = p_session_id);
  
  IF v_cart_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cart not found');
  END IF;
  
  -- Clear all items
  DELETE FROM cart_items WHERE cart_id = v_cart_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Cart cleared successfully'
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Function to merge carts when user logs in
CREATE OR REPLACE FUNCTION merge_carts(p_user_id UUID, p_session_id VARCHAR)
RETURNS JSONB AS $$
DECLARE
  user_cart_id UUID;
  session_cart_id UUID;
  merged_items INTEGER := 0;
BEGIN
  SELECT id INTO user_cart_id FROM carts WHERE user_id = p_user_id;
  SELECT id INTO session_cart_id FROM carts WHERE session_id = p_session_id;
  
  IF user_cart_id IS NOT NULL AND session_cart_id IS NOT NULL THEN
    -- Merge session cart into user cart
    INSERT INTO cart_items (cart_id, product_id, quantity, price_at_time)
    SELECT user_cart_id, product_id, quantity, price_at_time
    FROM cart_items 
    WHERE cart_id = session_cart_id
    ON CONFLICT (cart_id, product_id) DO UPDATE SET
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = NOW();
    
    GET DIAGNOSTICS merged_items = ROW_COUNT;
    
    -- Delete session cart
    DELETE FROM carts WHERE id = session_cart_id;
    
  ELSIF session_cart_id IS NOT NULL THEN
    -- Convert session cart to user cart
    UPDATE carts SET 
      user_id = p_user_id, 
      session_id = NULL,
      updated_at = NOW()
    WHERE id = session_cart_id;
    
    SELECT COUNT(*) INTO merged_items FROM cart_items WHERE cart_id = session_cart_id;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'merged_items', merged_items,
    'message', 'Carts merged successfully'
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;

-- Newsletter functions
CREATE OR REPLACE FUNCTION subscribe_newsletter(p_email VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO newsletter_subscriptions (email, is_active)
  VALUES (p_email, true)
  ON CONFLICT (email) DO UPDATE SET 
    is_active = true,
    subscribed_at = NOW(),
    unsubscribed_at = NULL;
  
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION unsubscribe_newsletter(p_email VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE newsletter_subscriptions 
  SET is_active = false, unsubscribed_at = NOW()
  WHERE email = p_email;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO users (email, password, full_name, role) VALUES 
('admin@example.com', '$2b$10$hashedpassword', 'Admin User', 'admin'),
('customer@example.com', '$2b$10$hashedpassword', 'John Doe', 'customer');

INSERT INTO products (
  name, model, sku, category, price, cost_price, description, short_description,
  specifications, thumbnail_image, images, weight_kg, slug, meta_title, meta_description, tags, stock_quantity
) VALUES 
(
  'Maverick MK3 Wash',
  'MK3-WASH',
  'CHAUVET-MK3W-001',
  'Wash Moving Heads',
  2499.00,
  1899.00,
  'High-output RGBW LED wash moving head with advanced zoom and exceptional color mixing capabilities. Features 37x15W RGBW LEDs, 7°-50° zoom range, and comprehensive DMX control.',
  'High-output RGBW LED wash moving head with advanced zoom',
  '{
    "power": {
      "consumption": {"value": 350, "unit": "W"},
      "input_voltage": {"value": "100-240", "unit": "V AC"},
      "frequency": {"value": "50/60", "unit": "Hz"}
    },
    "light_source": {
      "led_type": "RGBW LEDs",
      "led_quantity": 37,
      "led_power": {"value": 15, "unit": "W"},
      "color_temperature": {"min": 2700, "max": 8000, "unit": "K"},
      "cri": {"value": 95, "unit": "Ra"}
    },
    "optical": {
      "beam_angle": {"min": 7, "max": 50, "unit": "degrees"},
      "field_angle": {"min": 8, "max": 53, "unit": "degrees"},
      "zoom_ratio": "7:1",
      "lumen_output": {"value": 12000, "unit": "lm"}
    },
    "control": {
      "dmx_channels": {"basic": 16, "extended": 25},
      "control_protocols": ["DMX512", "RDM", "Art-Net", "sACN"],
      "display": "OLED with encoder wheel",
      "preset_programs": 10
    },
    "movement": {
      "pan": {"range": 540, "unit": "degrees"},
      "tilt": {"range": 270, "unit": "degrees"},
      "pan_speed": {"value": 2.3, "unit": "sec"},
      "tilt_speed": {"value": 1.2, "unit": "sec"}
    },
    "physical": {
      "dimensions": {"length": 350, "width": 420, "height": 580, "unit": "mm"},
      "weight": {"value": 18.5, "unit": "kg"},
      "mounting": "Dual yoke with safety cable point",
      "protection_rating": "IP20"
    },
    "certifications": ["CE", "RoHS", "FCC"],
    "accessories_included": ["Power cable", "DMX cable", "Safety cable", "Manual"]
  }',
  'assets/images/prod_maverick_mk3_wash_right.jpg',
  ARRAY['assets/images/gal_mav_mk3_wash_2.jpg', 'assets/images/gal_mav_mk3_wash_1.jpg'],
  18.5,
  'maverick-mk3-wash',
  'Chauvet Professional Maverick MK3 Wash - RGBW LED Moving Head',
  'Professional RGBW LED wash moving head with 37x15W LEDs, 7°-50° zoom, and comprehensive DMX control. Perfect for concerts and events.',
  ARRAY['moving head', 'wash light', 'RGBW', 'LED', 'DMX', 'professional lighting'],
  15
),
(
  'Wireless Mouse Pro',
  'WMP-2024',
  'TECH-WMP-001',
  'Electronics',
  29.99,
  18.50,
  'Ergonomic wireless mouse with precision tracking and long battery life.',
  'Ergonomic wireless mouse with precision tracking',
  '{
    "connectivity": {
      "type": "Wireless 2.4GHz",
      "range": {"value": 10, "unit": "m"},
      "battery_life": {"value": 12, "unit": "months"}
    },
    "sensor": {
      "type": "Optical",
      "dpi": {"min": 800, "max": 1600, "unit": "DPI"},
      "tracking_speed": {"value": 30, "unit": "ips"}
    },
    "physical": {
      "dimensions": {"length": 112, "width": 62, "height": 38, "unit": "mm"},
      "weight": {"value": 85, "unit": "g"},
      "buttons": 3
    },
    "compatibility": ["Windows", "macOS", "Linux"],
    "accessories_included": ["USB receiver", "User manual"]
  }',
  'assets/images/wireless-mouse-thumb.jpg',
  ARRAY['assets/images/wireless-mouse-front.jpg', 'assets/images/wireless-mouse-side.jpg'],
  0.085,
  'wireless-mouse-pro',
  'Wireless Mouse Pro - Ergonomic Design with Precision Tracking',
  'Professional wireless mouse with ergonomic design, precision optical sensor, and long battery life.',
  ARRAY['mouse', 'wireless', 'ergonomic', 'precision', 'computer accessories'],
  50
); 