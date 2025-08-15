# Deployment Guide - Fix Database Issues on Vercel

## Problem
Your Syafigraphy project is failing to add products on Vercel because it uses SQLite, which doesn't work on Vercel's serverless functions.

## Solution Options

### Option 1: Use Vercel Postgres (Recommended)

#### Step 1: Add Vercel Postgres
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Add Postgres to your project
vercel storage add postgres
```

#### Step 2: Install Dependencies
```bash
npm install @vercel/postgres
```

#### Step 3: Update Environment Variables
In your Vercel dashboard, add these environment variables:
```env
POSTGRES_URL=your-postgres-connection-string
POSTGRES_HOST=your-postgres-host
POSTGRES_DATABASE=your-database-name
POSTGRES_USERNAME=your-username
POSTGRES_PASSWORD=your-password
```

#### Step 4: Update Database Configuration
Replace `lib/database.ts` with Postgres implementation:

```typescript
import { sql } from '@vercel/postgres';

export async function getDatabase() {
  return sql;
}

// Update all database queries to use Postgres syntax
export const productDB = {
  getAll: async () => {
    const { rows } = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return rows;
  },
  
  create: async (product: any) => {
    const { rows } = await sql`
      INSERT INTO products (title, description, price, image_url, category)
      VALUES (${product.title}, ${product.description}, ${product.price}, ${product.image_url}, ${product.category})
      RETURNING id
    `;
    return rows[0]?.id;
  }
  // ... other methods
};
```

### Option 2: Use Supabase (Free Tier Available)

#### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Create new account and project
3. Get your project URL and anon key

#### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js
```

#### Step 3: Set Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Step 4: Create Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Option 3: Use PlanetScale (MySQL)

#### Step 1: Create PlanetScale Account
1. Go to [planetscale.com](https://planetscale.com)
2. Create new account and database
3. Get your connection string

#### Step 2: Install Dependencies
```bash
npm install mysql2
```

#### Step 3: Set Environment Variables
```env
DATABASE_URL=your-planetscale-connection-string
```

## Quick Fix for Immediate Deployment

If you want to deploy quickly without setting up a full database, you can use the mock database service I created:

### Step 1: Deploy with Current Code
```bash
vercel --prod
```

### Step 2: Set Environment Variables
In Vercel dashboard, add:
```env
DATABASE_URL=mock://localhost
```

This will use the mock database service that stores data in memory (data will be lost on each deployment, but it will work for testing).

## Database Schema Migration

### Export Current Data
```bash
# If you have data in your local SQLite database
sqlite3 data/syafigraphy.db ".dump" > database_dump.sql
```

### Create Tables in New Database
```sql
-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@syafigraphy.com', 'admin123');
```

## Testing After Deployment

### Test Admin Login
1. Go to `/admin/login`
2. Use credentials: `admin` / `admin123`
3. Try to add a product

### Test Product Creation
1. Go to `/admin/products/add`
2. Fill in product details
3. Submit the form
4. Check if product appears in the list

## Troubleshooting

### Error: "Failed to add product"
- Check if database environment variables are set
- Verify database connection
- Check Vercel function logs

### Error: "Database connection failed"
- Verify database credentials
- Check if database is accessible from Vercel
- Ensure database is not in private network

### Admin login not working
- Check if admin user exists in database
- Verify password hash
- Check authentication logic

## Next Steps

1. **Choose a database solution** (Vercel Postgres recommended)
2. **Set up the database** following the guide above
3. **Update your code** to use the new database
4. **Test locally** with the new database
5. **Deploy to Vercel** with proper environment variables
6. **Test all functionality** in production

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connection locally
4. Check database service status

