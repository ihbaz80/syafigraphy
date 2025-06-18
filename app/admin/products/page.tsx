'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  inStock: boolean
  featured: boolean
}

export default function AdminProducts() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated') === 'true'
      if (!authenticated) {
        router.push('/admin/login')
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
      loadProducts()
    }

    checkAuth()
  }, [router])

  const loadProducts = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use sample data
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Bismillah Calligraphy',
          price: 250,
          description: 'Beautiful Arabic calligraphy of Bismillah',
          category: 'Religious',
          image: '/images/gallery/khat1.jpg',
          inStock: true,
          featured: true
        },
        {
          id: '2',
          name: 'Alhamdulillah Art',
          price: 180,
          description: 'Elegant Alhamdulillah calligraphy piece',
          category: 'Religious',
          image: '/images/gallery/khat2.jpg',
          inStock: true,
          featured: false
        },
        {
          id: '3',
          name: 'Allahu Akbar Design',
          price: 300,
          description: 'Stunning Allahu Akbar calligraphy artwork',
          category: 'Religious',
          image: '/images/gallery/khat3.jpg',
          inStock: false,
          featured: true
        }
      ]
      setProducts(sampleProducts)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const handleDelete = (product: Product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id))
      setShowDeleteModal(false)
      setProductToDelete(null)
    }
  }

  const toggleStock = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    ))
  }

  const toggleFeatured = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, featured: !p.featured } : p
    ))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
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
                Product Management
              </h1>
            </div>
            <Link
              href="/admin/products/add"
              className="bg-amber-600 dark:bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300"
            >
              Add New Product
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Stock</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {products.filter(p => p.inStock).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {products.filter(p => p.featured).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {products.filter(p => !p.inStock).length}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      RM {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleStock(product.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.inStock
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                        {product.featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => toggleFeatured(product.id)}
                          className={`${
                            product.featured
                              ? 'text-gray-600 dark:text-gray-400'
                              : 'text-amber-600 dark:text-amber-400'
                          } hover:text-amber-500 dark:hover:text-amber-300`}
                        >
                          {product.featured ? 'Unfeature' : 'Feature'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 