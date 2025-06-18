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
  status: string
  paymentStatus: string
  orderDate: string
  paymentMethod: string
  notes?: string
  invoiceNumber: string
}

export default function GenerateInvoice() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<Order | null>(null)

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
        notes: 'Customer requested express delivery',
        invoiceNumber: `INV-${orderId}-${new Date().getFullYear()}`
      }
      
      setOrder(sampleOrder)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading order:', error)
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateSubtotal = () => {
    return order?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return subtotal * 0.06 // 6% GST
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading invoice...</p>
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
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href={`/admin/orders/${orderId}`} className="mr-4">
                <span className="text-amber-600 dark:text-amber-400 hover:text-amber-500">← Back to Order</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Invoice - {order.invoiceNumber}
              </h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300"
              >
                Print Invoice
              </button>
              <button
                onClick={() => window.open(`/admin/orders/${orderId}/invoice/download`, '_blank')}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Invoice Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 print:shadow-none print:border-none">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xl">🖼️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Syafigraphy</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Arabic Calligraphy Art Gallery</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>123 Calligraphy Street</p>
                <p>Kuala Lumpur, 50000</p>
                <p>Malaysia</p>
                <p>Phone: +60123456789</p>
                <p>Email: info@syafigraphy.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h2>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p><strong>Invoice #:</strong> {order.invoiceNumber}</p>
                <p><strong>Order #:</strong> {order.id}</p>
                <p><strong>Date:</strong> {formatDate(order.orderDate)}</p>
                <p><strong>Due Date:</strong> {formatDate(order.orderDate)}</p>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Bill To:</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                <p>{order.customerAddress}</p>
                <p>Email: {order.customerEmail}</p>
                <p>Phone: {order.customerPhone}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Information:</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Payment Status:</strong> 
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </p>
                <p><strong>Order Status:</strong> {order.status}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Item</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Quantity</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Unit Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-12 w-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Item #{item.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-900 dark:text-white">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-900 dark:text-white">RM {item.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                      RM {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">RM {calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">GST (6%):</span>
                  <span className="text-gray-900 dark:text-white">RM {calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t-2 border-gray-200 dark:border-gray-700 pt-2">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">RM {order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Terms:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment is due upon receipt of this invoice. Please include the invoice number with your payment.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Thank You:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thank you for choosing Syafigraphy for your calligraphy needs. We appreciate your business!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
        }
      `}</style>
    </div>
  )
} 