'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '@/lib/AdminAuthContext'

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderDate: string
  paymentMethod: string
  notes?: string
  trackingNumber?: string
  shippingAddress?: string
}

export default function OrderDetail() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const { isAuthenticated, getOrderById, updateOrderStatus, updateOrderTracking } = useAdminAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Get order from shared context
  const order = getOrderById(orderId)

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    
    // Check if order exists
    if (!order) {
      router.push('/admin/orders')
      return
    }
  }, [isAuthenticated, order, router, orderId])

  const handleUpdateOrderStatus = async (newStatus: Order['status']) => {
    if (!order) return
    
    setIsUpdating(true)
    setUpdateMessage(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update order status in shared context
      updateOrderStatus(orderId, newStatus)
      
      setUpdateMessage({
        type: 'success',
        message: `Order status updated to ${newStatus}`
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateMessage(null), 3000)
    } catch (error) {
      console.error('Error updating order status:', error)
      setUpdateMessage({
        type: 'error',
        message: 'Failed to update order status. Please try again.'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateTrackingNumber = async (trackingNumber: string) => {
    if (!order) return
    
    setIsUpdating(true)
    setUpdateMessage(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update tracking number in shared context
      updateOrderTracking(orderId, trackingNumber)
      
      setUpdateMessage({
        type: 'success',
        message: 'Tracking number updated successfully'
      })
      
      // Clear success message after 3 seconds
      setTimeout(() => setUpdateMessage(null), 3000)
    } catch (error) {
      console.error('Error updating tracking number:', error)
      setUpdateMessage({
        type: 'error',
        message: 'Failed to update tracking number. Please try again.'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
      case 'confirmed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
      case 'processing': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800'
      case 'shipped': return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800'
      case 'delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      case 'failed': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isUpdating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Updating order details...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !order) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/admin/orders" className="mr-4">
                <span className="text-amber-600 dark:text-amber-400 hover:text-amber-500">← Back to Orders</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Order {order.id}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(order.orderDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">RM {order.totalAmount}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerAddress}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">RM {item.price}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total: RM {item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">RM {order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Notes</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Status</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Order Status
                  </label>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(e.target.value as Order['status'])}
                      disabled={isUpdating}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:border-amber-400 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-white appearance-none cursor-pointer transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
                    >
                      <option value="pending" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">⏳ Pending</option>
                      <option value="confirmed" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">✅ Confirmed</option>
                      <option value="processing" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">⚙️ Processing</option>
                      <option value="shipped" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">🚚 Shipped</option>
                      <option value="delivered" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">📦 Delivered</option>
                      <option value="cancelled" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2">❌ Cancelled</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Current status:
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' && '⏳'}
                      {order.status === 'confirmed' && '✅'}
                      {order.status === 'processing' && '⚙️'}
                      {order.status === 'shipped' && '🚚'}
                      {order.status === 'delivered' && '📦'}
                      {order.status === 'cancelled' && '❌'}
                      <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={order.trackingNumber || ''}
                    onChange={(e) => handleUpdateTrackingNumber(e.target.value)}
                    disabled={isUpdating}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-700"
                  />
                  {order.trackingNumber && (
                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                      ✓ Tracking number saved
                    </p>
                  )}
                </div>

                {isUpdating && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
                    Updating order status...
                  </div>
                )}

                {/* Success/Error Messages */}
                {updateMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    updateMessage.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center">
                      <span className="mr-2">
                        {updateMessage.type === 'success' ? '✓' : '✕'}
                      </span>
                      {updateMessage.message}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {!isUpdating && !updateMessage && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Changes are saved automatically when you update the status.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Send Email to Customer
                </button>
                <Link
                  href={`/admin/orders/${order.id}/invoice`}
                  className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-center font-medium text-lg shadow-sm"
                >
                  🧾 Generate Invoice
                </Link>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300">
                  Download Order Details
                </button>
              </div>
              
              {/* Fallback Invoice Link */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Invoice Access:</p>
                <Link
                  href={`/admin/orders/${order.id}/invoice`}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-500 text-sm underline"
                >
                  Click here to view invoice for order {order.id}
                </Link>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {/* Order Placed - Always completed */}
                <div className="flex items-start">
                  <div className="h-3 w-3 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                
                {/* Payment Confirmed - Always completed if payment status is paid */}
                <div className="flex items-start">
                  <div className={`h-3 w-3 rounded-full mt-2 mr-3 ${
                    order.paymentStatus === 'paid' ? 'bg-green-500' : 
                    order.paymentStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Payment {order.paymentStatus === 'paid' ? 'Confirmed' : order.paymentStatus === 'pending' ? 'Pending' : 'Failed'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.paymentStatus === 'paid' ? formatDate(order.orderDate) : 
                       order.paymentStatus === 'pending' ? 'Awaiting payment' : 'Payment failed'}
                    </p>
                  </div>
                </div>
                
                {/* Order Confirmed */}
                <div className="flex items-start">
                  <div className={`h-3 w-3 rounded-full mt-2 mr-3 ${
                    ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' :
                    order.status === 'pending' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className={`text-sm font-medium ${
                      ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'text-gray-900 dark:text-white' :
                      order.status === 'pending' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Order Confirmed
                      {order.status === 'pending' && ' (Current)'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) ? formatDate(order.orderDate) :
                       order.status === 'pending' ? 'In progress' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                {/* Processing */}
                <div className="flex items-start">
                  <div className={`h-3 w-3 rounded-full mt-2 mr-3 ${
                    ['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-500' :
                    order.status === 'confirmed' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className={`text-sm font-medium ${
                      ['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-gray-900 dark:text-white' :
                      order.status === 'confirmed' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Processing
                      {order.status === 'confirmed' && ' (Current)'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {['processing', 'shipped', 'delivered'].includes(order.status) ? formatDate(order.orderDate) :
                       order.status === 'confirmed' ? 'In progress' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                {/* Shipped */}
                <div className="flex items-start">
                  <div className={`h-3 w-3 rounded-full mt-2 mr-3 ${
                    ['shipped', 'delivered'].includes(order.status) ? 'bg-green-500' :
                    order.status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className={`text-sm font-medium ${
                      ['shipped', 'delivered'].includes(order.status) ? 'text-gray-900 dark:text-white' :
                      order.status === 'processing' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Shipped
                      {order.status === 'processing' && ' (Current)'}
                      {order.trackingNumber && ' - ' + order.trackingNumber}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {['shipped', 'delivered'].includes(order.status) ? formatDate(order.orderDate) :
                       order.status === 'processing' ? 'In progress' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                {/* Delivered */}
                <div className="flex items-start">
                  <div className={`h-3 w-3 rounded-full mt-2 mr-3 ${
                    order.status === 'delivered' ? 'bg-green-500' :
                    order.status === 'shipped' ? 'bg-blue-500' : 'bg-gray-300'
                  }`}></div>
                  <div>
                    <p className={`text-sm font-medium ${
                      order.status === 'delivered' ? 'text-gray-900 dark:text-white' :
                      order.status === 'shipped' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Delivered
                      {order.status === 'shipped' && ' (Current)'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.status === 'delivered' ? formatDate(order.orderDate) :
                       order.status === 'shipped' ? 'In progress' : 'Pending'}
                    </p>
                  </div>
                </div>
                
                {/* Cancelled - Show only if order is cancelled */}
                {order.status === 'cancelled' && (
                  <div className="flex items-start">
                    <div className="h-3 w-3 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400">Order Cancelled</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 