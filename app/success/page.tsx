'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../../lib/CartContext'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    amount: '',
    status: '',
    billCode: ''
  })

  useEffect(() => {
    // Extract order details from URL parameters
    const orderId = searchParams.get('order_id') || ''
    const amount = searchParams.get('amount') || ''
    const status = searchParams.get('status') || ''
    const billCode = searchParams.get('billcode') || ''

    setOrderDetails({
      orderId,
      amount,
      status,
      billCode
    })

    // Clear cart after successful payment
    if (status === '1' || status === 'success') {
      clearCart()
    }
  }, [searchParams, clearCart])

  const isPaymentSuccessful = orderDetails.status === '1' || orderDetails.status === 'success'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            {isPaymentSuccessful ? (
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {isPaymentSuccessful ? 'Payment Successful!' : 'Payment Failed'}
          </h1>

          {/* Message */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {isPaymentSuccessful 
              ? 'Thank you for your purchase! Your order has been confirmed and will be processed shortly.'
              : 'We encountered an issue processing your payment. Please try again or contact support.'
            }
          </p>

          {/* Order Details */}
          {isPaymentSuccessful && orderDetails.orderId && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 p-8 border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order Details
              </h2>
              
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Order ID:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.orderId}</span>
                </div>
                
                {orderDetails.billCode && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Bill Code:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{orderDetails.billCode}</span>
                  </div>
                )}
                
                {orderDetails.amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Amount Paid:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">RM {parseFloat(orderDetails.amount).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Status:</span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                    Confirmed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          {isPaymentSuccessful && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What's Next?
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Order Confirmation:</strong> You'll receive an email confirmation within the next few minutes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Processing:</strong> Your artwork will be carefully prepared and packaged.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-amber-600 dark:bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Shipping:</strong> You'll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/gallery"
              className="bg-amber-600 dark:bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
            
            <Link 
              href="/contact"
              className="border-2 border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300"
            >
              Contact Support
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Have questions about your order?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">info@syafigraphy.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600 dark:text-gray-300">+60 12-345 6789</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 