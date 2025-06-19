'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../lib/CartContext'

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

export default function FeaturedGallery() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [quickViewArtwork, setQuickViewArtwork] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        // Get only featured products for the main page
        const featuredProducts = data.products.filter((product: Product) => product.featured).slice(0, 6)
        setProducts(featuredProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleQuickView = (artwork: Product) => {
    setQuickViewArtwork(artwork)
    setIsModalOpen(true)
  }

  const handleAddToCart = (artwork: Product) => {
    addItem({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      image: artwork.image,
      quantity: 1
    })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setQuickViewArtwork(null)
  }

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Artworks
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover our most popular and beautifully crafted Arabic calligraphy pieces. 
              Each artwork is handcrafted with precision and care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Featured Artworks
            </h2>
            <p className="text-red-600 dark:text-red-400">Error loading products: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Artworks
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover our most popular and beautifully crafted Arabic calligraphy pieces. 
            Each artwork is handcrafted with precision and care.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((artwork) => (
            <div
              key={artwork.id}
              className="card group"
              onMouseEnter={() => setHoveredId(artwork.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Artwork Image */}
              <div className="relative h-80 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-arabic text-amber-600 dark:text-amber-400 mb-4 opacity-80">الله</div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 opacity-70">Preview Image</p>
                  </div>
                </div>
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                  hoveredId === artwork.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <button 
                        onClick={() => handleQuickView(artwork)}
                        className="bg-amber-600 dark:bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 mb-3"
                      >
                        Quick View
                      </button>
                      <button 
                        onClick={() => handleAddToCart(artwork)}
                        className="bg-white text-amber-600 dark:text-amber-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Artwork Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                    {artwork.title}
                  </h3>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    RM {artwork.price}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {artwork.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
                    {artwork.category}
                  </span>
                  <span>{artwork.dimensions}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{artwork.medium}</span>
                  <Link 
                    href={`/shop/${artwork.id}`}
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-300"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link 
            href="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 dark:bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Artworks
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {isModalOpen && quickViewArtwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quickViewArtwork.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-arabic text-amber-600 dark:text-amber-400 mb-4 opacity-80">الله</div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 opacity-70">Preview Image</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {quickViewArtwork.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <span className="text-gray-900 dark:text-white">{quickViewArtwork.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Dimensions:</span>
                      <span className="text-gray-900 dark:text-white">{quickViewArtwork.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Medium:</span>
                      <span className="text-gray-900 dark:text-white">{quickViewArtwork.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Style:</span>
                      <span className="text-gray-900 dark:text-white">{quickViewArtwork.style}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      RM {quickViewArtwork.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {quickViewArtwork.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAddToCart(quickViewArtwork)}
                      disabled={!quickViewArtwork.inStock}
                      className="flex-1 bg-amber-600 dark:bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/shop/${quickViewArtwork.id}`}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
} 