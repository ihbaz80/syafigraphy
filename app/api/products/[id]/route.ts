import { NextResponse } from 'next/server'
import { productDB } from '@/lib/database'
import { supabaseDB } from '@/lib/supabaseDatabase'
import { hasSupabase } from '@/lib/databaseConfig'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params
  try {
    const id = parseInt(idParam)
    
    if (hasSupabase()) {
      const product = await supabaseDB.getProductById(id)
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json(product)
    } else {
      const product = productDB.getById(id)
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json(product)
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params
  try {
    const id = parseInt(idParam)
    const product = await request.json()
    
    console.log('Updating product:', { id, product })
    
    if (hasSupabase()) {
      console.log('Using Supabase for update')
      const success = await supabaseDB.updateProduct(id, product)
      console.log('Supabase update result:', success)
      if (success) {
        return NextResponse.json({ message: 'Product updated successfully' })
      } else {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
      }
    } else {
      console.log('Using local database for update')
      await productDB.update(id, product)
      return NextResponse.json({ message: 'Product updated successfully' })
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (hasSupabase()) {
      const success = await supabaseDB.deleteProduct(id)
      if (success) {
        return NextResponse.json({ message: 'Product deleted successfully' })
      } else {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
      }
    } else {
      await productDB.delete(id)
      return NextResponse.json({ message: 'Product deleted successfully' })
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
