import { NextRequest, NextResponse } from 'next/server'
import { productDB } from '@/lib/database'
import { productionDB } from '@/lib/productionDatabase'
import { supabaseDB } from '@/lib/supabaseDatabase'
import { hasExternalDatabase, hasSupabase } from '@/lib/databaseConfig'

export async function GET() {
  try {
    if (hasSupabase()) {
      const products = await supabaseDB.getAllProducts()
      return NextResponse.json({ products })
    } else if (hasExternalDatabase()) {
      const products = await productionDB.getAllProducts()
      return NextResponse.json({ products })
    } else {
      const products = productDB.getAll()
      return NextResponse.json({ products })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const product = await request.json()
    
    if (hasSupabase()) {
      const productId = await supabaseDB.createProduct(product)
      if (productId) {
        return NextResponse.json({ id: productId, message: 'Product created successfully' })
      } else {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
      }
    } else if (hasExternalDatabase()) {
      const productId = await productionDB.createProduct(product)
      if (productId) {
        return NextResponse.json({ id: productId, message: 'Product created successfully' })
      } else {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
      }
    } else {
      const productId = productDB.create(product)
      if (productId) {
        return NextResponse.json({ id: productId, message: 'Product created successfully' })
      } else {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
      }
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
} 