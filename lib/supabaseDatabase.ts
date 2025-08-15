import { supabase, TABLES, isSupabaseConfigured } from './supabase'
import type { Product, Order } from './productionDatabase'

export class SupabaseDatabaseService {
  // Check if Supabase is available
  private checkSupabase(): void {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured')
    }
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    try {
      this.checkSupabase()
      
      const { data, error } = await supabase!
        .from(TABLES.PRODUCTS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllProducts:', error)
      return []
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      this.checkSupabase()
      
      const { data, error } = await supabase!
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getProductById:', error)
      return null
    }
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<number | null> {
    try {
      this.checkSupabase()
      
      const { data, error } = await supabase!
        .from(TABLES.PRODUCTS)
        .insert([{
          ...productData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single()

      if (error) {
        console.error('Error creating product:', error)
        return null
      }

      return data?.id || null
    } catch (error) {
      console.error('Error in createProduct:', error)
      return null
    }
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<boolean> {
    try {
      this.checkSupabase()
      
      console.log('Supabase updateProduct called with:', { id, productData })
      
      // Map the incoming data to match Supabase column names
      const mappedData = {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        original_price: productData.original_price,
        image_url: productData.image_url,
        category: productData.category,
        dimensions: productData.dimensions,
        medium: productData.medium,
        style: productData.style,
        in_stock: productData.in_stock,
        featured: productData.featured,
        tags: productData.tags,
        rating: productData.rating,
        reviews_count: productData.reviews_count,
        shipping_weight: productData.shipping_weight,
        framed: productData.framed,
        customizable: productData.customizable,
        updated_at: new Date().toISOString()
      }
      
      console.log('Mapped data for Supabase:', mappedData)
      
      const { error } = await supabase!
        .from(TABLES.PRODUCTS)
        .update(mappedData)
        .eq('id', id)

      if (error) {
        console.error('Supabase update error:', error)
        return false
      }

      console.log('Supabase update successful')
      return true
    } catch (error) {
      console.error('Error in updateProduct:', error)
      return false
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      this.checkSupabase()
      
      const { error } = await supabase!
        .from(TABLES.PRODUCTS)
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteProduct:', error)
      return false
    }
  }

  async getProductCount(): Promise<number> {
    try {
      this.checkSupabase()
      
      const { count, error } = await supabase!
        .from(TABLES.PRODUCTS)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error counting products:', error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error('Error in getProductCount:', error)
      return 0
    }
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    try {
      this.checkSupabase()
      
      const { data, error } = await supabase!
        .from(TABLES.ORDERS)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllOrders:', error)
      return []
    }
  }

  async getOrderById(id: number): Promise<Order | null> {
    try {
      this.checkSupabase()
      
      const { data, error } = await supabase!
        .from(TABLES.ORDERS)
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getOrderById:', error)
      return null
    }
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<number | null> {
    try {
      this.checkSupabase()
      
      const { data, error } = await supabase!
        .from(TABLES.ORDERS)
        .insert([{
          ...orderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('id')
        .single()

      if (error) {
        console.error('Error creating order:', error)
        return null
      }

      return data?.id || null
    } catch (error) {
      console.error('Error in createOrder:', error)
      return null
    }
  }

  async updateOrderStatus(id: number, status: string): Promise<boolean> {
    try {
      this.checkSupabase()
      
      const { error } = await supabase!
        .from(TABLES.ORDERS)
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating order status:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateOrderStatus:', error)
      return false
    }
  }

  async getOrderCount(): Promise<number> {
    try {
      this.checkSupabase()
      
      const { count, error } = await supabase!
        .from(TABLES.ORDERS)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error counting orders:', error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error('Error in getOrderCount:', error)
      return 0
    }
  }

  // Admin authentication
  async authenticateAdmin(username: string, password: string): Promise<boolean> {
    try {
      this.checkSupabase()
      
      const { data, error } = await supabase!
        .from(TABLES.ADMIN_USERS)
        .select('*')
        .eq('username', username)
        .eq('password_hash', password)
        .single()

      if (error) {
        console.error('Error authenticating admin:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error in authenticateAdmin:', error)
      return false
    }
  }
}

// Export singleton instance
export const supabaseDB = new SupabaseDatabaseService()
