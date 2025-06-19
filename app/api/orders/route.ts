import { NextRequest, NextResponse } from 'next/server'
import { orderDB } from '@/lib/database'

export async function GET() {
  try {
    const orders = orderDB.getAll()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    // Generate order number
    const timestamp = Date.now()
    const orderNumber = `ORD-${timestamp}`
    
    const order = {
      ...orderData,
      order_number: orderNumber
    }
    
    const orderId = orderDB.create(order)
    
    // Add order items if provided
    if (orderData.items && orderData.items.length > 0) {
      orderDB.addItems(Number(orderId), orderData.items)
    }
    
    return NextResponse.json({ 
      id: orderId, 
      order_number: orderNumber,
      message: 'Order created successfully' 
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
} 