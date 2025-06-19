'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAdminAuth } from '@/lib/AdminAuthContext'

interface ProductForm {
  title: string
  price: string
  description: string
  category: string
  image: string
  inStock: boolean
  featured: boolean
  dimensions: string
  medium: string
  style: string
  tags: string
  shippingWeight: string
  framed: boolean
  customizable: boolean
}

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const productId = parseInt(params.id as string)
  
  const { isAuthenticated, products, updateProduct } = useAdminAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [formData, setFormData] = useState<ProductForm>({
    title: '',
    price: '',
    description: '',
    category: 'Religious',
    image: '',
    inStock: true,
    featured: false,
    dimensions: '',
    medium: '',
    style: '',
    tags: '',
    shippingWeight: '',
    framed: true,
    customizable: true
  })

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    // Load product data
    const foundProduct = products.find(p => p.id === productId)
    if (foundProduct) {
      setProduct(foundProduct)
      setFormData({
        title: foundProduct.title,
        price: foundProduct.price.toString(),
        description: foundProduct.description,
        category: foundProduct.category,
        image: foundProduct.image,
        inStock: foundProduct.inStock,
        featured: foundProduct.featured,
        dimensions: foundProduct.dimensions || '',
        medium: foundProduct.medium || '',
        style: foundProduct.style || '',
        tags: foundProduct.tags ? foundProduct.tags.join(', ') : '',
        shippingWeight: foundProduct.shippingWeight || '',
        framed: foundProduct.framed || false,
        customizable: foundProduct.customizable || false
      })
    } else {
      // Product not found, redirect to products page
      router.push('/admin/products')
    }
  }, [isAuthenticated, router, productId, products])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Convert form data to product format
      const updatedProduct = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        dimensions: formData.dimensions || undefined,
        medium: formData.medium || undefined,
        style: formData.style || undefined,
        inStock: formData.inStock,
        featured: formData.featured,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        shippingWeight: formData.shippingWeight || undefined,
        framed: formData.framed,
        customizable: formData.customizable
      }
      
      // Update the product using the shared context
      await updateProduct(productId, updatedProduct)
      
      // Redirect back to products page
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product...</p>
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
              <Link href="/admin/products" className="mr-4">
                <span className="text-amber-600 dark:text-amber-400 hover:text-amber-500">← Back to Products</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Product
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Product Information</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Product ID: {productId}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Bismillah Calligraphy"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (RM) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="250.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe the calligraphy piece, its meaning, and artistic details..."
              />
            </div>

            {/* Category and Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="Religious">Religious</option>
                  <option value="Contemporary">Contemporary</option>
                  <option value="Decorative">Decorative</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Business">Business</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calligraphy Style
                </label>
                <input
                  type="text"
                  id="style"
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Thuluth, Naskh, Diwani"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                id="image"
                name="image"
                required
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter the URL of the product image
              </p>
            </div>

            {/* Dimensions and Medium */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 50cm x 30cm"
                />
              </div>

              <div>
                <label htmlFor="medium" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Medium
                </label>
                <input
                  type="text"
                  id="medium"
                  name="medium"
                  value={formData.medium}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Gold leaf on canvas, Acrylic paint"
                />
              </div>
            </div>

            {/* Tags and Shipping Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., bismillah, quran, gold, traditional"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Separate tags with commas
                </p>
              </div>

              <div>
                <label htmlFor="shippingWeight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shipping Weight
                </label>
                <input
                  type="text"
                  id="shippingWeight"
                  name="shippingWeight"
                  value={formData.shippingWeight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., 2.5kg"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="inStock" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  In Stock
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Featured Product
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="framed"
                  name="framed"
                  checked={formData.framed}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="framed" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Framed
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="customizable"
                  name="customizable"
                  checked={formData.customizable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="customizable" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Customizable
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/products"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Product...
                  </div>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
} 