'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../../lib/CartContext'

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [updatingItem, setUpdatingItem] = useState<number | null>(null)
  const [removingItem, setRemovingItem] = useState<number | null>(null)

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return
    
    setUpdatingItem(itemId)
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    updateQuantity(itemId, newQuantity)
    setUpdatingItem(null)
  }

  const handleRemoveItem = async (itemId: number) => {
    setRemovingItem(itemId)
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    
    removeItem(itemId)
    setRemovingItem(null)
  }

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  const calculateShipping = (): number => {
    return state.total >= 200 ? 0 : 15
  }

  const calculateTotal = (): number => {
    return state.total + calculateShipping()
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl font-arabic text-amber-200 dark:text-amber-600 mb-4">لا</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Looks like you haven't added any beautiful calligraphy pieces to your cart yet.
            </p>
            <Link 
              href="/gallery"
              className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 dark:bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Browse Gallery
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 dark:from-amber-700 dark:via-orange-700 dark:to-red-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Shopping Cart
          </h1>
          <p className="text-xl">
            Review your selected artworks and proceed to checkout
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700">
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Cart Items ({state.itemCount})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-300"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {state.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-2xl font-arabic text-amber-600 dark:text-amber-400">الله</div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-amber-600 dark:text-amber-400 font-bold">
                          RM {item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItem === item.id}
                          className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                          -
                        </button>
                        
                        <span className="w-12 text-center text-lg font-semibold text-gray-900 dark:text-white">
                          {updatingItem === item.id ? '...' : item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10 || updatingItem === item.id}
                          className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-0">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          RM {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItem === item.id}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingItem === item.id ? (
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h3>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">RM {state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Shipping</span>
                  <span className="text-gray-900 dark:text-white">
                    {calculateShipping() === 0 ? 'Free' : `RM ${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-amber-600 dark:text-amber-400">RM {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {calculateShipping() > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6 border border-amber-200 dark:border-amber-700">
                  <p className="text-amber-800 dark:text-amber-200 text-sm">
                    💡 Add RM {(200 - state.total).toFixed(2)} more to your cart for <strong>FREE SHIPPING</strong>!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full bg-amber-600 dark:bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/gallery"
                  className="w-full border-2 border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 py-3 px-6 rounded-lg font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300 text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free shipping on orders above RM 200</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure payment with ToyyibPay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
