import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Database configuration
const isProduction = process.env.NODE_ENV === 'production'
const useExternalDB = process.env.DATABASE_URL || process.env.POSTGRES_URL

// Database file path (local only)
const DB_PATH = path.join(process.cwd(), 'data', 'syafigraphy.db')

// Ensure data directory exists (local only)
if (!isProduction && !useExternalDB) {
  const dataDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Initialize database
let db: Database.Database | null = null

export function getDatabase(): Database.Database | null {
  // In production with external DB, return null
  if (isProduction && useExternalDB) {
    return null
  }
  
  // Local development with SQLite
  if (!db && !useExternalDB) {
    try {
      db = new Database(DB_PATH)
      db.pragma('journal_mode = WAL')
      initializeTables()
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error)
      return null
    }
  }
  
  return db
}

// Check if database is available
export function isDatabaseAvailable(): boolean {
  if (isProduction && useExternalDB) {
    return true // External DB configured
  }
  return getDatabase() !== null
}

// Type definitions
interface CountResult {
  count: number
}

interface OrderWithItems {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_address?: string
  total_amount: number
  status: string
  payment_status: string
  payment_method?: string
  tracking_number?: string
  notes?: string
  created_at: string
  updated_at: string
  items?: any[]
}

// Database schema
function initializeTables() {
  const db = getDatabase()
  if (!db) return
  
  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      image_url TEXT,
      category TEXT,
      dimensions TEXT,
      medium TEXT,
      style TEXT,
      in_stock BOOLEAN DEFAULT 1,
      featured BOOLEAN DEFAULT 0,
      tags TEXT,
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      shipping_weight TEXT,
      framed BOOLEAN DEFAULT 0,
      customizable BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      customer_address TEXT,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      payment_method TEXT,
      tracking_number TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_image TEXT,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `)

  // Admin users table
  if (db) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert default admin user if not exists
    const adminExists = db.prepare('SELECT COUNT(*) as count FROM admin_users WHERE username = ?').get('admin') as CountResult
    if (adminExists.count === 0) {
      db.prepare(`
        INSERT INTO admin_users (username, email, password_hash) 
        VALUES (?, ?, ?)
      `).run('admin', 'admin@syafigraphy.com', 'admin123') // In production, use proper password hashing
    }
  }

  // Insert sample products if table is empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as CountResult
  if (productCount.count === 0) {
    insertSampleProducts()
  }
}

// Insert sample products
function insertSampleProducts() {
  const db = getDatabase()
  if (!db) return
  
  const sampleProducts = [
    {
      title: "Bismillah Al-Rahman Al-Raheem",
      description: "Beautiful calligraphy of the opening verse of the Quran. This piece features elegant Arabic script with gold leaf accents on a premium canvas background.",
      price: 299,
      original_price: 399,
      image_url: "/images/artwork-1.jpg",
      category: "Religious",
      dimensions: "60cm x 40cm",
      medium: "Gold leaf on canvas",
      style: "Traditional",
      in_stock: 1,
      featured: 1,
      tags: "bismillah,quran,gold,traditional",
      rating: 5,
      reviews_count: 12,
      shipping_weight: "2.5kg",
      framed: 1,
      customizable: 1
    },
    {
      title: "Allah - The Divine Name",
      description: "Elegant representation of Allah's name in traditional calligraphy style. Perfect for home decoration or as a meaningful gift.",
      price: 199,
      original_price: 249,
      image_url: "/images/artwork-2.jpg",
      category: "Religious",
      dimensions: "50cm x 50cm",
      medium: "Acrylic on canvas",
      style: "Traditional",
      in_stock: 1,
      featured: 1,
      tags: "allah,divine,traditional,square",
      rating: 5,
      reviews_count: 8,
      shipping_weight: "2kg",
      framed: 1,
      customizable: 1
    },
    {
      title: "Surah Al-Fatiha",
      description: "The opening chapter of the Quran beautifully rendered in calligraphy. This piece includes the complete seven verses with decorative elements.",
      price: 399,
      original_price: 499,
      image_url: "/images/artwork-3.jpg",
      category: "Religious",
      dimensions: "80cm x 60cm",
      medium: "Mixed media on paper",
      style: "Traditional",
      in_stock: 1,
      featured: 1,
      tags: "surah,fatiha,quran,complete",
      rating: 5,
      reviews_count: 15,
      shipping_weight: "3kg",
      framed: 1,
      customizable: 0
    },
    {
      title: "Peace & Harmony",
      description: "Contemporary Arabic calligraphy design featuring the word 'Salam' (Peace) in a modern artistic style. Perfect for contemporary home decor.",
      price: 249,
      original_price: 299,
      image_url: "/images/artwork-4.jpg",
      category: "Contemporary",
      dimensions: "70cm x 50cm",
      medium: "Ink on handmade paper",
      style: "Modern",
      in_stock: 1,
      featured: 1,
      tags: "peace,salam,contemporary,modern",
      rating: 4.8,
      reviews_count: 6,
      shipping_weight: "2.2kg",
      framed: 0,
      customizable: 1
    },
    {
      title: "The Prophet's Name",
      description: "Muhammad ﷺ in elegant script with decorative floral elements. A beautiful tribute piece for any Muslim home.",
      price: 179,
      original_price: 229,
      image_url: "/images/artwork-5.jpg",
      category: "Religious",
      dimensions: "45cm x 45cm",
      medium: "Gold and black ink",
      style: "Traditional",
      in_stock: 1,
      featured: 0,
      tags: "muhammad,prophet,traditional,gold",
      rating: 4.9,
      reviews_count: 10,
      shipping_weight: "1.8kg",
      framed: 1,
      customizable: 1
    },
    {
      title: "Modern Arabic Poetry",
      description: "Contemporary verse in calligraphic style featuring a beautiful Arabic poem about love and beauty.",
      price: 329,
      original_price: 379,
      image_url: "/images/artwork-6.jpg",
      category: "Contemporary",
      dimensions: "90cm x 60cm",
      medium: "Mixed media on canvas",
      style: "Modern",
      in_stock: 1,
      featured: 1,
      tags: "poetry,contemporary,modern,canvas",
      rating: 4.7,
      reviews_count: 4,
      shipping_weight: "3.5kg",
      framed: 1,
      customizable: 0
    },
    {
      title: "Ayat Al-Kursi",
      description: "The Throne Verse beautifully calligraphed with intricate geometric patterns and gold accents.",
      price: 449,
      original_price: 549,
      image_url: "/images/artwork-7.jpg",
      category: "Religious",
      dimensions: "100cm x 70cm",
      medium: "Gold leaf and ink on canvas",
      style: "Traditional",
      in_stock: 1,
      featured: 1,
      tags: "ayat,kursi,throne,verse,gold",
      rating: 5,
      reviews_count: 18,
      shipping_weight: "4kg",
      framed: 1,
      customizable: 0
    },
    {
      title: "Abstract Arabic Letters",
      description: "Modern abstract interpretation of Arabic letters in a contemporary art style. Perfect for modern interiors.",
      price: 279,
      original_price: 329,
      image_url: "/images/artwork-8.jpg",
      category: "Contemporary",
      dimensions: "80cm x 80cm",
      medium: "Acrylic on canvas",
      style: "Abstract",
      in_stock: 1,
      featured: 0,
      tags: "abstract,modern,contemporary,letters",
      rating: 4.6,
      reviews_count: 7,
      shipping_weight: "3kg",
      framed: 0,
      customizable: 1
    },
    {
      title: "Family Blessing",
      description: "Beautiful calligraphy piece featuring family blessings and prayers in elegant Arabic script.",
      price: 189,
      original_price: 239,
      image_url: "/images/artwork-9.jpg",
      category: "Religious",
      dimensions: "55cm x 40cm",
      medium: "Ink on premium paper",
      style: "Traditional",
      in_stock: 1,
      featured: 0,
      tags: "family,blessing,prayer,traditional",
      rating: 4.8,
      reviews_count: 9,
      shipping_weight: "1.5kg",
      framed: 1,
      customizable: 1
    },
    {
      title: "Geometric Patterns",
      description: "Contemporary geometric patterns inspired by Islamic art with Arabic calligraphy elements.",
      price: 359,
      original_price: 409,
      image_url: "/images/artwork-10.jpg",
      category: "Contemporary",
      dimensions: "75cm x 75cm",
      medium: "Mixed media on canvas",
      style: "Geometric",
      in_stock: 1,
      featured: 1,
      tags: "geometric,patterns,contemporary,modern",
      rating: 4.9,
      reviews_count: 11,
      shipping_weight: "3.2kg",
      framed: 1,
      customizable: 0
    },
    {
      title: "Minimalist Allah",
      description: "Minimalist design featuring Allah's name in a clean, modern style. Perfect for contemporary spaces.",
      price: 159,
      original_price: 199,
      image_url: "/images/artwork-11.jpg",
      category: "Contemporary",
      dimensions: "40cm x 40cm",
      medium: "Ink on paper",
      style: "Minimalist",
      in_stock: 1,
      featured: 0,
      tags: "minimalist,allah,modern,clean",
      rating: 4.7,
      reviews_count: 5,
      shipping_weight: "1kg",
      framed: 0,
      customizable: 1
    },
    {
      title: "Traditional Du'a",
      description: "Traditional supplication beautifully calligraphed with decorative borders and traditional motifs.",
      price: 229,
      original_price: 279,
      image_url: "/images/artwork-12.jpg",
      category: "Religious",
      dimensions: "65cm x 45cm",
      medium: "Gold and black ink on paper",
      style: "Traditional",
      in_stock: 1,
      featured: 0,
      tags: "dua,supplication,traditional,gold",
      rating: 4.8,
      reviews_count: 8,
      shipping_weight: "2kg",
      framed: 1,
      customizable: 1
    }
  ]

  const insertProduct = db.prepare(`
    INSERT INTO products (
      title, description, price, original_price, image_url, category, 
      dimensions, medium, style, in_stock, featured, tags, rating, 
      reviews_count, shipping_weight, framed, customizable
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  for (const product of sampleProducts) {
    insertProduct.run(
      product.title,
      product.description,
      product.price,
      product.original_price,
      product.image_url,
      product.category,
      product.dimensions,
      product.medium,
      product.style,
      product.in_stock,
      product.featured,
      product.tags,
      product.rating,
      product.reviews_count,
      product.shipping_weight,
      product.framed,
      product.customizable
    )
  }
}

// Product operations
export const productDB = {
  getAll: () => {
    const db = getDatabase()
    if (!db) return []
    return db.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
  },

  getById: (id: number) => {
    const db = getDatabase()
    if (!db) return null
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  },

  create: (product: any) => {
    const db = getDatabase()
    if (!db) return null
    const stmt = db.prepare(`
      INSERT INTO products (
        title, description, price, original_price, image_url, category,
        dimensions, medium, style, in_stock, featured, tags, rating,
        reviews_count, shipping_weight, framed, customizable
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      product.title,
      product.description,
      product.price,
      product.original_price,
      product.image_url,
      product.category,
      product.dimensions,
      product.medium,
      product.style,
      product.in_stock ? 1 : 0,
      product.featured ? 1 : 0,
      product.tags,
      product.rating,
      product.reviews_count,
      product.shipping_weight,
      product.framed ? 1 : 0,
      product.customizable ? 1 : 0
    )
    
    return result.lastInsertRowid
  },

  update: (id: number, product: any) => {
    const db = getDatabase()
    if (!db) return null
    const stmt = db.prepare(`
      UPDATE products SET
        title = ?, description = ?, price = ?, original_price = ?, 
        image_url = ?, category = ?, dimensions = ?, medium = ?, 
        style = ?, in_stock = ?, featured = ?, tags = ?, rating = ?,
        reviews_count = ?, shipping_weight = ?, framed = ?, 
        customizable = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    return stmt.run(
      product.title,
      product.description,
      product.price,
      product.original_price,
      product.image_url,
      product.category,
      product.dimensions,
      product.medium,
      product.style,
      product.in_stock ? 1 : 0,
      product.featured ? 1 : 0,
      product.tags,
      product.rating,
      product.reviews_count,
      product.shipping_weight,
      product.framed ? 1 : 0,
      product.customizable ? 1 : 0,
      id
    )
  },

  delete: (id: number) => {
    const db = getDatabase()
    if (!db) return null
    return db.prepare('DELETE FROM products WHERE id = ?').run(id)
  },

  getCount: () => {
    const db = getDatabase()
    if (!db) return 0
    const result = db.prepare('SELECT COUNT(*) as count FROM products').get() as CountResult
    return result.count
  }
}

// Order operations
export const orderDB = {
  getAll: () => {
    const db = getDatabase()
    if (!db) return []
    return db.prepare(`
      SELECT o.*, 
             GROUP_CONCAT(oi.product_name || ' (x' || oi.quantity || ')') as items_summary
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all()
  },

  getById: (id: number): OrderWithItems | undefined => {
    const db = getDatabase()
    if (!db) return undefined
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderWithItems | undefined
    if (order) {
      order.items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id)
    }
    return order
  },

  create: (order: any) => {
    const db = getDatabase()
    if (!db) return null
    const stmt = db.prepare(`
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        customer_address, total_amount, status, payment_status,
        payment_method, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      order.order_number,
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.customer_address,
      order.total_amount,
      order.status,
      order.payment_status,
      order.payment_method,
      order.notes
    )
    
    return result.lastInsertRowid
  },

  updateStatus: (id: number, status: string) => {
    const db = getDatabase()
    if (!db) return null
    return db.prepare(`
      UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(status, id)
  },

  updateTracking: (id: number, trackingNumber: string) => {
    const db = getDatabase()
    if (!db) return null
    return db.prepare(`
      UPDATE orders SET tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(trackingNumber, id)
  },

  addItems: (orderId: number, items: any[]) => {
    const db = getDatabase()
    if (!db) return
    const stmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    for (const item of items) {
      stmt.run(orderId, item.product_id, item.product_name, item.product_image, item.quantity, item.price)
    }
  },

  getCount: () => {
    const db = getDatabase()
    if (!db) return 0
    const result = db.prepare('SELECT COUNT(*) as count FROM orders').get() as CountResult
    return result.count
  }
}

// Admin operations
export const adminDB = {
  authenticate: (username: string, password: string) => {
    const db = getDatabase()
    if (!db) return null
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ? AND password_hash = ?').get(username, password)
    return user
  }
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close()
  }
} 