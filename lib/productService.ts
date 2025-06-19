import productData from '@/data/product.json'

export interface Product {
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

export interface ProductData {
  products: Product[]
  categories: Array<{ id: string; name: string; description: string; count: number }>
  styles: Array<{ id: string; name: string; description: string }>
}

// In-memory storage for admin modifications
let adminProducts: Product[] = [...productData.products]

export const productService = {
  // Get all products (for shop page)
  getAllProducts: (): Product[] => {
    return adminProducts
  },

  // Get product data with categories and styles (for shop page)
  getProductData: (): ProductData => {
    return {
      ...productData,
      products: adminProducts
    }
  },

  // Admin functions
  addProduct: (product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...adminProducts.map(p => p.id), 0) + 1
    }
    adminProducts.push(newProduct)
    return newProduct
  },

  updateProduct: (id: number, product: Partial<Product>): Product | null => {
    const index = adminProducts.findIndex(p => p.id === id)
    if (index !== -1) {
      adminProducts[index] = { ...adminProducts[index], ...product }
      return adminProducts[index]
    }
    return null
  },

  deleteProduct: (id: number): boolean => {
    const index = adminProducts.findIndex(p => p.id === id)
    if (index !== -1) {
      adminProducts.splice(index, 1)
      return true
    }
    return false
  },

  getProductById: (id: number): Product | undefined => {
    return adminProducts.find(p => p.id === id)
  },

  // Reset to original data (for testing)
  resetToOriginal: () => {
    adminProducts = [...productData.products]
  }
} 