'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '@/lib/AdminAuthContext'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated, logout, orders, products, loadProducts } = useAdminAuth()
  const [adminUser, setAdminUser] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication on component mount
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    
    const user = localStorage.getItem('adminUser') || 'Admin'
    setAdminUser(user)
    
    // Ensure products are loaded
    const initializeData = async () => {
      try {
        await loadProducts()
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeData()
  }, [isAuthenticated, router])

  // Watch for changes in products array
  useEffect(() => {
    console.log('Products changed:', products.length)
  }, [products])

  const handleLogout = () => {
    logout()
  }

  // Calculate dashboard metrics
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const pendingOrders = orders.filter(order => order.status === 'pending').length

  console.log('Dashboard - Products count:', totalProducts)
  console.log('Dashboard - Products array:', products)
  console.log('Dashboard - Orders count:', totalOrders)

  // Debug logging
  console.log('Dashboard Debug:', {
    productsCount: totalProducts,
    products: products,
    ordersCount: totalOrders,
    orders: orders
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-amber-600 dark:bg-amber-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">🖼️</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Syafigraphy Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {adminUser}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard Overview
          </h2>
          
          {/* Debug Info */}
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Debug: Products loaded: {products.length} | Orders loaded: {orders.length}
            </p>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              Products: {products.map(p => p.id).join(', ')}
            </p>
            <button 
              onClick={() => loadProducts()}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Reload Products
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Products */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xl">📦</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
                </div>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">RM {totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 text-xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/products/add"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">➕</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Add New Product</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Create a new calligraphy piece</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/products/table"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 dark:text-indigo-400">📋</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">View Product Table</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">See all products in table format</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400">📋</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">View Orders</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Manage customer orders</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400">📊</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Analytics</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">View sales reports</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Latest Orders</h4>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customerName} - RM {order.totalAmount}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        order.status === 'confirmed' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        order.status === 'processing' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                        order.status === 'shipped' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}>
                        {order.status}
                      </span>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-500 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 