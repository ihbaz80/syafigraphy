'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../../lib/CartContext'
import { ToyyibPayService, validateToyyibPayConfig, TOYYIBPAY_ERRORS } from '../../lib/toyyibpay'

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface OrderItem {
  id: number
  title: string
  price: number
  quantity: number
  image: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { state, clearCart } = useCart()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Malaysia'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})
  const [paymentError, setPaymentError] = useState('')

  // Redirect if cart is empty
  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/gallery')
    }
  }, [state.items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name as keyof CustomerInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    // Clear payment error when user makes changes
    if (paymentError) {
      setPaymentError('')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {}
    
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required'
    if (!customerInfo.city.trim()) newErrors.city = 'City is required'
    if (!customerInfo.state.trim()) newErrors.state = 'State is required'
    if (!customerInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckout = async () => {
    if (!validateForm()) return

    // Validate ToyyibPay configuration
    if (!validateToyyibPayConfig()) {
      setPaymentError(TOYYIBPAY_ERRORS.CONFIG_MISSING)
      return
    }

    setIsProcessing(true)
    setPaymentError('')

    try {
      // Create order object
      const order = {
        items: state.items,
        customer: customerInfo,
        total: calculateTotal(),
        orderId: ToyyibPayService.generateOrderId(),
        timestamp: new Date().toISOString()
      }

      // Initialize ToyyibPay payment
      ToyyibPayService.createPaymentForm(order)

    } catch (error) {
      console.error('Checkout error:', error)
      setPaymentError(TOYYIBPAY_ERRORS.NETWORK_ERROR)
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateShipping = (): number => {
    // Free shipping for orders above RM 200
    return state.total >= 200 ? 0 : 15
  }

  const calculateTotal = (): number => {
    return state.total + calculateShipping()
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-arabic text-amber-200 dark:text-amber-600 mb-4">لا</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Add some beautiful calligraphy pieces to your cart first.</p>
          <button 
            onClick={() => router.push('/gallery')}
            className="btn-primary"
          >
            Browse Gallery
          </button>
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
            Checkout
          </h1>
          <p className="text-xl">
            Complete your purchase securely with ToyyibPay
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="+60 12-345 6789"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={customerInfo.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Postal Code"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Malaysia">Malaysia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                      <div className="text-2xl font-arabic text-amber-600 dark:text-amber-400">الله</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">RM {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
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
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-amber-600 dark:text-amber-400">RM {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Payment Method
              </h3>
              <div className="flex items-center space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                <div className="w-8 h-8 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">ToyyibPay</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Secure payment gateway</p>
                </div>
              </div>
            </div>

            {/* Payment Error */}
            {paymentError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{paymentError}</p>
              </div>
            )}

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-amber-600 dark:bg-amber-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isProcessing ? 'Processing...' : `Pay RM ${calculateTotal().toFixed(2)}`}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              By completing your purchase, you agree to our{' '}
              <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 