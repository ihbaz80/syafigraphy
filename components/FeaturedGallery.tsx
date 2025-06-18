'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../lib/CartContext'

// Sample featured artworks data
const featuredArtworks = [
  {
    id: 1,
    title: "Bismillah Al-Rahman Al-Raheem",
    description: "Beautiful calligraphy of the opening verse",
    price: 299,
    image: "/images/artwork-1.jpg",
    category: "Religious",
    dimensions: "60cm x 40cm",
    medium: "Gold leaf on canvas"
  },
  {
    id: 2,
    title: "Allah - The Divine Name",
    description: "Elegant representation of Allah's name",
    price: 199,
    image: "/images/artwork-2.jpg",
    category: "Religious",
    dimensions: "50cm x 50cm",
    medium: "Acrylic on canvas"
  },
  {
    id: 3,
    title: "Surah Al-Fatiha",
    description: "The opening chapter of the Quran",
    price: 399,
    image: "/images/artwork-3.jpg",
    category: "Religious",
    dimensions: "80cm x 60cm",
    medium: "Mixed media on paper"
  },
  {
    id: 4,
    title: "Peace & Harmony",
    description: "Contemporary Arabic calligraphy design",
    price: 249,
    image: "/images/artwork-4.jpg",
    category: "Contemporary",
    dimensions: "70cm x 50cm",
    medium: "Ink on handmade paper"
  },
  {
    id: 5,
    title: "The Prophet's Name",
    description: "Muhammad ﷺ in elegant script",
    price: 179,
    image: "/images/artwork-5.jpg",
    category: "Religious",
    dimensions: "45cm x 45cm",
    medium: "Gold and black ink"
  },
  {
    id: 6,
    title: "Modern Arabic Poetry",
    description: "Contemporary verse in calligraphic style",
    price: 329,
    image: "/images/artwork-6.jpg",
    category: "Contemporary",
    dimensions: "90cm x 60cm",
    medium: "Mixed media on canvas"
  }
]

export default function FeaturedGallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [quickViewArtwork, setQuickViewArtwork] = useState<typeof featuredArtworks[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem } = useCart()

  const handleQuickView = (artwork: typeof featuredArtworks[0]) => {
    setQuickViewArtwork(artwork)
    setIsModalOpen(true)
  }

  const handleAddToCart = (artwork: typeof featuredArtworks[0]) => {
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
          {featuredArtworks.map((artwork) => (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quick View
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Artwork Image */}
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl font-arabic text-amber-600 dark:text-amber-400 mb-4 opacity-80">الله</div>
                    <p className="text-lg text-amber-700 dark:text-amber-300 font-semibold">Artwork Preview</p>
                  </div>
                </div>

                {/* Artwork Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {quickViewArtwork.title}
                    </h3>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-4">
                      RM {quickViewArtwork.price}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {quickViewArtwork.description}
                    </p>
                  </div>

                  {/* Artwork Specifications */}
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Category:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{quickViewArtwork.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Dimensions:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{quickViewArtwork.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Medium:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{quickViewArtwork.medium}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => handleAddToCart(quickViewArtwork)}
                      className="flex-1 bg-amber-600 dark:bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                    <Link
                      href={`/shop/${quickViewArtwork.id}`}
                      onClick={closeModal}
                      className="flex-1 border-2 border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 py-3 px-6 rounded-lg font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300 text-center"
                    >
                      View Full Details
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