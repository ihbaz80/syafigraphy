import { NextRequest, NextResponse } from 'next/server'
import { ToyyibPayService } from '../../../lib/toyyibpay'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract ToyyibPay response data
    const billCode = formData.get('billcode') as string
    const orderId = formData.get('order_id') as string
    const status = formData.get('status') as string
    const amount = formData.get('amount') as string
    const reason = formData.get('reason') as string

    // Validate response
    if (!billCode || !orderId || !status) {
      console.error('Invalid ToyyibPay callback data:', { billCode, orderId, status })
      return NextResponse.json({ error: 'Invalid callback data' }, { status: 400 })
    }

    // Get payment status
    const paymentStatus = ToyyibPayService.getPaymentStatus(status)

    // Log the callback for debugging
    console.log('ToyyibPay Callback:', {
      billCode,
      orderId,
      status: paymentStatus,
      amount,
      reason,
      timestamp: new Date().toISOString()
    })

    // Here you would typically:
    // 1. Update order status in your database
    // 2. Send confirmation email to customer
    // 3. Update inventory
    // 4. Log the transaction

    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      status: paymentStatus,
      message: 'Payment callback processed successfully'
    })

  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests (for testing or manual verification)
  const { searchParams } = new URL(request.url)
  const billCode = searchParams.get('billcode')
  const orderId = searchParams.get('order_id')
  const status = searchParams.get('status')

  if (!billCode || !orderId || !status) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  const paymentStatus = ToyyibPayService.getPaymentStatus(status)

  return NextResponse.json({
    billCode,
    orderId,
    status: paymentStatus,
    timestamp: new Date().toISOString()
  })
} 