'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderDate: string
  paymentMethod: string
  notes?: string
  trackingNumber?: string
  shippingAddress?: string
}

interface Product {
  id: number
  title: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  dimensions?: string
  medium?: string
  style?: string
  inStock: boolean
  featured: boolean
  tags?: string[]
  rating?: number
  reviews?: number
  shippingWeight?: string
  framed?: boolean
  customizable?: boolean
}

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  orders: Order[]
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => void
  updateOrderTracking: (orderId: string, trackingNumber: string) => void
  getOrderById: (orderId: string) => Order | undefined
  loadOrders: () => Promise<void>
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  loadProducts: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = localStorage.getItem('adminAuthenticated') === 'true'
    setIsAuthenticated(authenticated)
    
    if (authenticated) {
      console.log('User is authenticated, loading data...')
      loadOrders()
      loadProducts()
    } else {
      console.log('User is not authenticated')
    }
  }, []) // Empty dependency array to run only once

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('adminAuthenticated', 'true')
        localStorage.setItem('adminUser', username)
        setIsAuthenticated(true)
        await loadOrders()
        await loadProducts()
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminUser')
    setIsAuthenticated(false)
    setOrders([])
    setProducts([])
    router.push('/admin/login')
  }

  const loadOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      // Transform database orders to match the interface
      const transformedOrders: Order[] = data.map((order: any) => ({
        id: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone || '',
        customerAddress: order.customer_address || '',
        items: order.items || [],
        totalAmount: order.total_amount,
        status: order.status as Order['status'],
        paymentStatus: order.payment_status as Order['paymentStatus'],
        orderDate: order.created_at,
        paymentMethod: order.payment_method || 'ToyyibPay',
        notes: order.notes,
        trackingNumber: order.tracking_number,
        shippingAddress: order.customer_address
      }))
      
      setOrders(transformedOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const loadProducts = async () => {
    try {
      console.log('Loading products...')
      const response = await fetch('/api/products')
      const data = await response.json()
      
      console.log('API Response data:', data)
      console.log('Products array length:', data.products?.length || 0)
      
      // Transform database products to match the interface
      const transformedProducts: Product[] = data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price,
        image: product.image_url,
        category: product.category,
        dimensions: product.dimensions,
        medium: product.medium,
        style: product.style,
        inStock: Boolean(product.in_stock),
        featured: Boolean(product.featured),
        tags: product.tags ? product.tags.split(',') : [],
        rating: product.rating,
        reviews: product.reviews_count,
        shippingWeight: product.shipping_weight,
        framed: Boolean(product.framed),
        customizable: Boolean(product.customizable)
      }))
      
      console.log('Transformed products length:', transformedProducts.length)
      console.log('Setting products in state...')
      
      setProducts(transformedProducts)
      
      console.log('Products state updated')
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    }
  }

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          price: product.price,
          original_price: product.originalPrice,
          image_url: product.image,
          category: product.category,
          dimensions: product.dimensions,
          medium: product.medium,
          style: product.style,
          in_stock: product.inStock,
          featured: product.featured,
          tags: product.tags ? product.tags.join(',') : '',
          rating: product.rating,
          reviews_count: product.reviews,
          shipping_weight: product.shippingWeight,
          framed: product.framed,
          customizable: product.customizable
        }),
      })

      if (response.ok) {
        await loadProducts() // Reload products to get the updated list
      } else {
        throw new Error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const updateProduct = async (id: number, product: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          price: product.price,
          original_price: product.originalPrice,
          image_url: product.image,
          category: product.category,
          dimensions: product.dimensions,
          medium: product.medium,
          style: product.style,
          in_stock: product.inStock,
          featured: product.featured,
          tags: product.tags ? product.tags.join(',') : '',
          rating: product.rating,
          reviews_count: product.reviews,
          shipping_weight: product.shippingWeight,
          framed: product.framed,
          customizable: product.customizable
        }),
      })

      if (response.ok) {
        await loadProducts() // Reload products to get the updated list
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await loadProducts() // Reload products to get the updated list
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const updateOrderTracking = (orderId: string, trackingNumber: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, trackingNumber } : order
      )
    )
  }

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId)
  }

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      orders,
      updateOrderStatus,
      updateOrderTracking,
      getOrderById,
      loadOrders,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      loadProducts
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
} 