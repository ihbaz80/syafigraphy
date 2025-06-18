'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import productData from '../../data/product.json'
import { useCart } from '../../lib/CartContext'

interface Product {
  id: number
  title: string
  description: string
  price: number
  originalPrice: number
  image: string
  category: string
  dimensions: string
  medium: string
  style: string
  inStock: boolean
  featured: boolean
  rating: number
  reviews: number
}

export default function GalleryPage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStyle, setSelectedStyle] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  useEffect(() => {
    setProducts(productData.products)
    setFilteredProducts(productData.products)
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by style
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(product => product.style === selectedStyle)
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case 'featured':
        filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, selectedStyle, sortBy])

  const handleAddToCart = (product: Product) => {
    setAddingToCart(product.id)
    
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    
    setTimeout(() => {
      setAddingToCart(null)
    }, 1000)
  }

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]
  const styles = ['all', ...Array.from(new Set(products.map(p => p.style)))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 dark:from-amber-700 dark:via-orange-700 dark:to-red-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Art Gallery
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Explore our collection of beautiful Arabic calligraphy artwork. 
            Each piece is handcrafted with precision and care.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search artworks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {styles.map(style => (
                  <option key={style} value={style}>
                    {style === 'all' ? 'All Styles' : style}
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing {filteredProducts.length} of {products.length} artworks
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedStyle('all')
                setSortBy('featured')
              }}
              className="px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="card group"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Product Image */}
                <div className="relative h-64 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-arabic text-amber-600 dark:text-amber-400 mb-2 opacity-80">الله</div>
                      <p className="text-sm text-amber-700 dark:text-amber-300 opacity-70">Preview Image</p>
                    </div>
                  </div>
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                    hoveredId === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Link 
                          href={`/shop/${product.id}`}
                          className="bg-amber-600 dark:bg-amber-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 mb-2 inline-block"
                        >
                          View Details
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          disabled={addingToCart === product.id}
                          className="bg-white text-amber-600 dark:text-amber-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-4 left-4 bg-amber-600 dark:bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                    <div className="flex items-center">
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">{product.rating}</span>
                      <svg className="w-3 h-3 text-amber-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                    {product.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs">
                        {product.category}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{product.dimensions}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.originalPrice > product.price && (
                        <span className="text-gray-400 dark:text-gray-500 text-sm line-through">
                          RM {product.originalPrice}
                        </span>
                      )}
                      <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        RM {product.price}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{product.medium}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl font-arabic text-amber-200 dark:text-amber-600 mb-4">لا</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No artworks found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedStyle('all')
                setSortBy('featured')
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
