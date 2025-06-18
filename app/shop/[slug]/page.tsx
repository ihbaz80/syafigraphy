'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import productData from '../../../data/product.json'
import { useCart } from '../../../lib/CartContext'

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

export default function ProductDetailPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    const productId = parseInt(params.slug as string)
    const foundProduct = productData.products.find(p => p.id === productId)
    setProduct(foundProduct || null)
  }, [params.slug])

  const handleAddToCart = () => {
    if (!product) return
    
    setIsAddingToCart(true)
    setCartMessage('')
    
    // Add to cart using context
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity
    })
    
    // Show success message
    setTimeout(() => {
      setCartMessage(`Added ${quantity} ${quantity === 1 ? 'piece' : 'pieces'} to cart!`)
      setIsAddingToCart(false)
      
      // Clear message after 3 seconds
      setTimeout(() => setCartMessage(''), 3000)
    }, 500)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-arabic text-amber-200 dark:text-amber-600 mb-4">لا</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/gallery" className="btn-primary">
            Back to Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/gallery" className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">
              Gallery
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-12 text-center aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl font-arabic text-amber-600 dark:text-amber-400 mb-4 opacity-80">الله</div>
                <p className="text-lg text-amber-700 dark:text-amber-300 font-semibold">Product Image</p>
              </div>
            </div>
            
            {/* Product badges */}
            <div className="flex flex-wrap gap-2">
              {product.featured && (
                <span className="bg-amber-600 dark:bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </span>
              )}
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-semibold">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.title}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                {product.originalPrice > product.price && (
                  <span className="text-2xl text-gray-400 dark:text-gray-500 line-through">
                    RM {product.originalPrice}
                  </span>
                )}
                <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  RM {product.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Dimensions</h4>
                <p className="text-gray-600 dark:text-gray-300">{product.dimensions}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Medium</h4>
                <p className="text-gray-600 dark:text-gray-300">{product.medium}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Style</h4>
                <p className="text-gray-600 dark:text-gray-300">{product.style}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Category</h4>
                <p className="text-gray-600 dark:text-gray-300">{product.category}</p>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-16 text-center text-lg font-semibold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Cart Message */}
              {cartMessage && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">{cartMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className="flex-1 bg-amber-600 dark:bg-amber-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <Link 
                  href="/cart"
                  className="flex-1 border-2 border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 py-4 px-6 rounded-lg font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300 text-center"
                >
                  View Cart
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Additional Information</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Handcrafted with premium materials</li>
                <li>• Certificate of authenticity included</li>
                <li>• Free shipping within Malaysia</li>
                <li>• 30-day return policy</li>
                <li>• Professional packaging</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Artworks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productData.products
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/shop/${relatedProduct.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow duration-300"
                >
                  <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-arabic text-amber-600 dark:text-amber-400 mb-2 opacity-80">الله</div>
                      <p className="text-sm text-amber-700 dark:text-amber-300">Preview</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-amber-600 dark:text-amber-400 font-bold">
                      RM {relatedProduct.price}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 