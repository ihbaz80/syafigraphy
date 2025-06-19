'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../../lib/CartContext'

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

interface ProductData {
  products: Product[]
  categories: Array<{ id: string; name: string; description: string; count: number }>
  styles: Array<{ id: string; name: string; description: string }>
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStyle, setSelectedStyle] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        
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
        
        setProducts(transformedProducts)
        setFilteredProducts(transformedProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category.toLowerCase() === selectedCategory)
    }

    // Filter by style
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(product => product.style?.toLowerCase() === selectedStyle)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'reviews':
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, selectedStyle, searchTerm, sortBy])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  // Get unique categories and styles from products
  const categories = Array.from(new Set(products.map(p => p.category)))
    .map(cat => ({ id: cat.toLowerCase(), name: cat, description: `${cat} calligraphy`, count: products.filter(p => p.category === cat).length }))

  const styles = Array.from(new Set(products.map(p => p.style).filter(Boolean)))
    .map(style => ({ id: style!.toLowerCase(), name: style!, description: `${style} style calligraphy` }))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Products Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setSelectedStyle('all')
              setSearchTerm('')
              setSortBy('featured')
            }}
            className="bg-amber-600 dark:bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 dark:from-amber-700 dark:via-orange-700 dark:to-red-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-xl">Discover beautiful Arabic calligraphy artworks</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Style Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Style
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Styles</option>
                {styles.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Product Image */}
              <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      RM {product.price}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        RM {product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {product.rating || 0} ({product.reviews || 0})
                    </span>
                  </div>
                </div>

                {/* Category and Style */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                  {product.style && (
                    <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
                      {product.style}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    href={`/shop/${product.id}`}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-center text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="flex-1 bg-amber-600 dark:bg-amber-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

