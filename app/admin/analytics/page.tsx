'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  monthlyRevenue: { month: string; revenue: number }[]
  topProducts: { name: string; sales: number; revenue: number }[]
  orderStatusDistribution: { status: string; count: number }[]
  customerSegments: { segment: string; count: number; revenue: number }[]
  recentOrders: { id: string; customer: string; amount: number; date: string }[]
}

export default function Analytics() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState('30') // days

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated') === 'true'
      if (!authenticated) {
        router.push('/admin/login')
        return
      }
      setIsAuthenticated(true)
      loadAnalytics()
    }

    checkAuth()
  }, [router, dateRange])

  const loadAnalytics = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Sample analytics data
      const sampleData: AnalyticsData = {
        totalRevenue: 15420,
        totalOrders: 47,
        averageOrderValue: 328,
        conversionRate: 3.2,
        monthlyRevenue: [
          { month: 'Jan', revenue: 3200 },
          { month: 'Feb', revenue: 2800 },
          { month: 'Mar', revenue: 4100 },
          { month: 'Apr', revenue: 3800 },
          { month: 'May', revenue: 5200 },
          { month: 'Jun', revenue: 4800 }
        ],
        topProducts: [
          { name: 'Bismillah Calligraphy', sales: 12, revenue: 3000 },
          { name: 'Alhamdulillah Art', sales: 8, revenue: 1440 },
          { name: 'Allahu Akbar Design', sales: 6, revenue: 1800 },
          { name: 'Surah Al-Fatiha', sales: 5, revenue: 1250 },
          { name: 'Custom Name Calligraphy', sales: 4, revenue: 800 }
        ],
        orderStatusDistribution: [
          { status: 'Delivered', count: 25 },
          { status: 'Processing', count: 8 },
          { status: 'Shipped', count: 6 },
          { status: 'Pending', count: 5 },
          { status: 'Cancelled', count: 3 }
        ],
        customerSegments: [
          { segment: 'New Customers', count: 15, revenue: 4200 },
          { segment: 'Returning Customers', count: 25, revenue: 8900 },
          { segment: 'VIP Customers', count: 7, revenue: 2320 }
        ],
        recentOrders: [
          { id: 'ORD-001', customer: 'Ahmad bin Abdullah', amount: 250, date: '2024-01-15' },
          { id: 'ORD-002', customer: 'Siti binti Mohamed', amount: 660, date: '2024-01-14' },
          { id: 'ORD-003', customer: 'Mohammed Ali', amount: 250, date: '2024-01-13' },
          { id: 'ORD-004', customer: 'Fatimah Zahra', amount: 450, date: '2024-01-12' },
          { id: 'ORD-005', customer: 'Abdul Rahman', amount: 320, date: '2024-01-11' }
        ]
      }
      
      setAnalyticsData(sampleData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading analytics:', error)
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      case 'Processing': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
      case 'Shipped': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
      case 'Pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
      case 'Cancelled': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !analyticsData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="mr-4">
                <span className="text-amber-600 dark:text-amber-400 hover:text-amber-500">← Back to Dashboard</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Analytics & Reports
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button className="px-4 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(analyticsData.totalRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(analyticsData.averageOrderValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                <span className="text-amber-600 dark:text-amber-400 text-xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.monthlyRevenue.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-amber-500 rounded-t"
                    style={{ height: `${(item.revenue / Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue))) * 200}px` }}
                  ></div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.month}</p>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status Distribution</h3>
            <div className="space-y-3">
              {analyticsData.orderStatusDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${getStatusColor(item.status).split(' ')[0]}`}></div>
                    <span className="text-sm text-gray-900 dark:text-white">{item.status}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products and Customer Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Segments</h3>
            <div className="space-y-4">
              {analyticsData.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{segment.segment}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{segment.count} customers</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(segment.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-amber-600 dark:text-amber-400 hover:text-amber-500 text-sm"
            >
              View All Orders →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {analyticsData.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString('en-MY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
} 