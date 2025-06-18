'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

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
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated') === 'true'
      if (!authenticated) {
        router.push('/admin/login')
        return
      }
      setIsAuthenticated(true)
      loadOrder()
    }

    checkAuth()
  }, [router, orderId])

  const loadOrder = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Sample order data
      const sampleOrder: Order = {
        id: orderId,
        customerName: 'Ahmad bin Abdullah',
        customerEmail: 'ahmad@email.com',
        customerPhone: '+60123456789',
        customerAddress: '123 Jalan Melaka, Kuala Lumpur, 50000',
        shippingAddress: '123 Jalan Melaka, Kuala Lumpur, 50000',
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'Bismillah Calligraphy',
            productImage: '/images/gallery/khat1.jpg',
            quantity: 1,
            price: 250
          },
          {
            id: '2',
            productId: '2',
            productName: 'Alhamdulillah Art',
            productImage: '/images/gallery/khat2.jpg',
            quantity: 2,
            price: 180
          }
        ],
        totalAmount: 610,
        status: 'processing',
        paymentStatus: 'paid',
        orderDate: '2024-01-15T10:30:00Z',
        paymentMethod: 'ToyyibPay',
        notes: 'Customer requested express delivery and careful packaging',
        trackingNumber: 'TRK123456789MY'
      }
      
      setOrder(sampleOrder)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading order:', error)
      setIsLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: Order['status']) => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrder({ ...order, status: newStatus })
      setIsUpdating(false)
    } catch (error) {
      console.error('Error updating order status:', error)
      setIsUpdating(false)
    }
  }

  const updateTrackingNumber = async (trackingNumber: string) => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrder({ ...order, trackingNumber })
      setIsUpdating(false)
    } catch (error) {
      console.error('Error updating tracking number:', error)
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      case 'confirmed': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      case 'processing': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
      case 'shipped': return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200'
      case 'delivered': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
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
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(e.target.value as Order['status'])}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={order.trackingNumber || ''}
                    onChange={(e) => updateTrackingNumber(e.target.value)}
                    disabled={isUpdating}
                    placeholder="Enter tracking number"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  />
                </div>

                {isUpdating && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mr-2"></div>
                    Updating...
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
                  className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-center"
                >
                  Generate Invoice
                </Link>
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300">
                  Download Order Details
                </button>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-3 w-3 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-3 w-3 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Confirmed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-3 w-3 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Processing</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-3 w-3 bg-gray-300 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Shipped</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Pending</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-3 w-3 bg-gray-300 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 