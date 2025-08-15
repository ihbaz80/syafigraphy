-- Supabase Database Setup for Syafigraphy
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
-- Note: You may need to disable RLS for development or configure policies

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  image_url TEXT,
  category VARCHAR(100),
  dimensions VARCHAR(100),
  medium VARCHAR(100),
  style VARCHAR(100),
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  tags TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  shipping_weight VARCHAR(50),
  framed BOOLEAN DEFAULT false,
  customizable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_address TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(100),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user
-- Note: In production, use proper password hashing
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@syafigraphy.com', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Insert sample products
INSERT INTO products (title, description, price, original_price, image_url, category, dimensions, medium, style, in_stock, featured, tags, rating, reviews_count, shipping_weight, framed, customizable) VALUES
(
  'Bismillah Al-Rahman Al-Raheem',
  'Beautiful calligraphy of the opening verse of the Quran. This piece features elegant Arabic script with gold leaf accents on a premium canvas background.',
  299.00,
  399.00,
  '/images/artwork-1.jpg',
  'Religious',
  '60cm x 40cm',
  'Gold leaf on canvas',
  'Traditional',
  true,
  true,
  'bismillah,quran,gold,traditional',
  5.0,
  12,
  '2.5kg',
  true,
  true
),
(
  'Allah - The Divine Name',
  'Elegant representation of Allah''s name in traditional calligraphy style. Perfect for home decoration or as a meaningful gift.',
  199.00,
  249.00,
  '/images/artwork-2.jpg',
  'Religious',
  '50cm x 50cm',
  'Acrylic on canvas',
  'Traditional',
  true,
  true,
  'allah,divine,traditional,square',
  5.0,
  8,
  '2kg',
  true,
  true
),
(
  'Surah Al-Fatiha',
  'The opening chapter of the Quran beautifully rendered in calligraphy. This piece includes the complete seven verses with decorative elements.',
  399.00,
  499.00,
  '/images/artwork-3.jpg',
  'Religious',
  '80cm x 60cm',
  'Mixed media on paper',
  'Traditional',
  true,
  true,
  'surah,fatiha,quran,complete',
  5.0,
  15,
  '3kg',
  true,
  false
),
(
  'Peace & Harmony',
  'Contemporary Arabic calligraphy design featuring the word ''Salam'' (Peace) in a modern artistic style. Perfect for contemporary home decor.',
  249.00,
  299.00,
  '/images/artwork-4.jpg',
  'Contemporary',
  '70cm x 50cm',
  'Ink on handmade paper',
  'Modern',
  true,
  true,
  'salam,peace,contemporary,modern',
  4.8,
  10,
  '1.8kg',
  false,
  true
)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust based on your Supabase setup)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
