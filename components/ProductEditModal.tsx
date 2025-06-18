'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  id: number
  title: string
  description: string
  price: number
  originalPrice: number
  image: string
  images: string[]
  category: string
  dimensions: string
  medium: string
  style: string
  inStock: boolean
  featured: boolean
  tags: string[]
  rating: number
  reviews: number
  shippingWeight: string
  framed: boolean
  customizable: boolean
}

interface ProductEditModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onSave: (product: Product) => void
}

export default function ProductEditModal({ product, isOpen, onClose, onSave }: ProductEditModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData(product)
      setErrors({})
    }
  }, [product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm() && product) {
      onSave({ ...product, ...formData })
      onClose()
    }
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Product</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Image */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{product.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Product ID: {product.id}</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select Category</option>
                <option value="religious">Religious</option>
                <option value="contemporary">Contemporary</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (RM) *
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Price (RM)
              </label>
              <input
                type="number"
                name="originalPrice"
                step="0.01"
                value={formData.originalPrice || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions || ''}
                onChange={handleInputChange}
                placeholder="e.g., 50cm x 70cm"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medium
              </label>
              <input
                type="text"
                name="medium"
                value={formData.medium || ''}
                onChange={handleInputChange}
                placeholder="e.g., Canvas, Paper"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Style
              </label>
              <input
                type="text"
                name="style"
                value={formData.style || ''}
                onChange={handleInputChange}
                placeholder="e.g., Traditional, Modern"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Product</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="framed"
                checked={formData.framed || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Framed</label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="customizable"
                checked={formData.customizable || false}
                onChange={handleInputChange}
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Customizable</label>
            </div>
          </div>

          {/* Rating and Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Reviews
              </label>
              <input
                type="number"
                name="reviews"
                min="0"
                value={formData.reviews || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 dark:bg-amber-500 rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 