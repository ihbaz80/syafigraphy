// Production Database Service
// This service will be used when external database is configured

export interface Product {
  id: number
  title: string
  description: string
  price: number
  original_price?: number
  image_url?: string
  category?: string
  dimensions?: string
  medium?: string
  style?: string
  in_stock: boolean
  featured: boolean
  tags?: string
  rating?: number
  reviews_count?: number
  shipping_weight?: string
  framed: boolean
  customizable: boolean
  created_at: string
  updated_at: string
}

export interface Order {
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
}

// Mock database service for production (replace with actual database implementation)
export class ProductionDatabaseService {
  private static instance: ProductionDatabaseService
  private products: Product[] = []
  private orders: Order[] = []
  private nextProductId = 1
  private nextOrderId = 1

  static getInstance(): ProductionDatabaseService {
    if (!ProductionDatabaseService.instance) {
      ProductionDatabaseService.instance = new ProductionDatabaseService()
    }
    return ProductionDatabaseService.instance
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    // In production, this would query the actual database
    return this.products
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const product: Product = {
      id: this.nextProductId++,
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.products.push(product)
    return product.id
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.products[index] = {
      ...this.products[index],
      ...productData,
      updated_at: new Date().toISOString()
    }
    return true
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.products.splice(index, 1)
    return true
  }

  async getProductCount(): Promise<number> {
    return this.products.length
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return this.orders
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const order: Order = {
      id: this.nextOrderId++,
      ...orderData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    this.orders.push(order)
    return order.id
  }

  async updateOrderStatus(id: number, status: string): Promise<boolean> {
    const order = this.orders.find(o => o.id === id)
    if (!order) return false
    
    order.status = status
    order.updated_at = new Date().toISOString()
    return true
  }

  async getOrderCount(): Promise<number> {
    return this.orders.length
  }

  // Admin authentication
  async authenticateAdmin(username: string, password: string): Promise<boolean> {
    // In production, this would check against the actual database
    // For now, use hardcoded credentials (replace with proper authentication)
    return username === 'admin' && password === 'admin123'
  }
}

// Export singleton instance
export const productionDB = ProductionDatabaseService.getInstance()

