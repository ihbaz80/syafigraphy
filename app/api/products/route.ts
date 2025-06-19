import { NextRequest, NextResponse } from 'next/server'
import { productDB } from '@/lib/database'

export async function GET() {
  try {
    const products = productDB.getAll()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    const productId = productDB.create(product)
    return NextResponse.json({ id: productId, message: 'Product created successfully' })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
} 