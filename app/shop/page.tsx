'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../../lib/CartContext'
import productData from '../../data/product.json'

interface Product {
  id: number
  title: string
  description: string
  price: number
  originalPrice: number
  image: string
  images: string[]
  category: string
  dimensions: string
  medium: string
  style: string
  inStock: boolean
  featured: boolean
  tags: string[]
  rating: number
  reviews: number
  shippingWeight: string
  framed: boolean
  customizable: boolean
}

interface ProductData {
  products: Product[]
  categories: Array<{ id: string; name: string; description: string; count: number }>
  styles: Array<{ id: string; name: string; description: string }>
}

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productData.products)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStyle, setSelectedStyle] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const { addItem } = useCart()

  // Filter and sort products
  useEffect(() => {
    let filtered = productData.products

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category.toLowerCase() === selectedCategory)
    }

    // Filter by style
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(product => product.style.toLowerCase() === selectedStyle)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, selectedStyle, searchTerm, sortBy])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    })
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
                {productData.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
                {productData.styles.map(style => (
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredProducts.length} of {productData.products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/70 transition-shadow duration-300">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Featured
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {product.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    RM {product.price.toFixed(2)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      RM {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 space-y-1">
                  <div>Size: {product.dimensions}</div>
                  <div>Medium: {product.medium}</div>
                  <div className="flex items-center gap-2">
                    <span>★ {product.rating}</span>
                    <span>({product.reviews} reviews)</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/shop/${product.id}`}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 text-center"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className="flex-1 bg-amber-600 dark:bg-amber-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
