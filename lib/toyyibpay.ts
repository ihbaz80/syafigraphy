export interface ToyyibPayConfig {
  userSecretKey: string
  categoryCode: string
  billName: string
  billDescription: string
  billPriceSetting: number
  billPayorInfo: number
  billAmount: number
  billReturnUrl: string
  billCallbackUrl: string
  billExternalReferenceNo: string
  billTo: string
  billEmail: string
  billPhone: string
  billSplitPayment: number
  billSplitPaymentArgs: string
  billPaymentChannel: string
  billDisplayMerchant: number
  billContentEmail: string
  billChargeToCustomer: number
  billExpiryDays: number
  billExpiryDate: string
  billIsFixedAmount: number
  billContentSMS: string
  billPaymentChannelInfo: string
  billDiscountAmount: number
  billDiscountPercentage: number
  billMerchantId: string
}

export interface OrderData {
  items: Array<{
    id: number
    title: string
    price: number
    quantity: number
    image: string
  }>
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  total: number
  orderId: string
  timestamp: string
}

export class ToyyibPayService {
  private static readonly API_URL = 'https://toyyibpay.com/index.php/api/createBill'
  
  static createPaymentForm(orderData: OrderData): void {
    const config: ToyyibPayConfig = {
      userSecretKey: process.env.NEXT_PUBLIC_TOYYIBPAY_SECRET_KEY || '',
      categoryCode: process.env.NEXT_PUBLIC_TOYYIBPAY_CATEGORY_CODE || '',
      billName: 'Syafigraphy Arabic Calligraphy',
      billDescription: `Order ${orderData.orderId} - ${orderData.items.length} item(s)`,
      billPriceSetting: 1, // Fixed price
      billPayorInfo: 1, // Collect customer info
      billAmount: Math.round(orderData.total * 100), // Convert to cents
      billReturnUrl: `${window.location.origin}/success`,
      billCallbackUrl: `${window.location.origin}/api/payment-callback`,
      billExternalReferenceNo: orderData.orderId,
      billTo: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
      billEmail: orderData.customer.email,
      billPhone: orderData.customer.phone,
      billSplitPayment: 0,
      billSplitPaymentArgs: '',
      billPaymentChannel: '0', // All payment channels
      billDisplayMerchant: 1,
      billContentEmail: 'Thank you for your purchase from Syafigraphy! Your order is being processed.',
      billChargeToCustomer: 0,
      billExpiryDays: 3,
      billExpiryDate: '',
      billIsFixedAmount: 1,
      billContentSMS: 'Thank you for your purchase from Syafigraphy!',
      billPaymentChannelInfo: '',
      billDiscountAmount: 0,
      billDiscountPercentage: 0,
      billMerchantId: process.env.NEXT_PUBLIC_TOYYIBPAY_MERCHANT_ID || ''
    }

    // Validate required fields
    if (!config.userSecretKey || !config.categoryCode || !config.billMerchantId) {
      throw new Error('ToyyibPay configuration is incomplete. Please check your environment variables.')
    }

    // Create and submit form
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = this.API_URL
    form.style.display = 'none'

    Object.entries(config).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value.toString()
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  static validatePaymentResponse(response: any): boolean {
    // Validate ToyyibPay response
    if (!response || typeof response !== 'object') {
      return false
    }

    // Check for required fields in response
    const requiredFields = ['BillCode', 'Status']
    return requiredFields.every(field => response.hasOwnProperty(field))
  }

  static getPaymentStatus(status: string): 'success' | 'pending' | 'failed' {
    switch (status.toLowerCase()) {
      case '1':
      case 'success':
      case 'completed':
        return 'success'
      case '0':
      case 'pending':
      case 'processing':
        return 'pending'
      default:
        return 'failed'
    }
  }

  static formatAmount(amount: number): string {
    return `RM ${amount.toFixed(2)}`
  }

  static generateOrderId(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `ORD-${timestamp}-${random}`
  }
}

// Environment variables validation
export const validateToyyibPayConfig = (): boolean => {
  const requiredVars = [
    'NEXT_PUBLIC_TOYYIBPAY_SECRET_KEY',
    'NEXT_PUBLIC_TOYYIBPAY_CATEGORY_CODE',
    'NEXT_PUBLIC_TOYYIBPAY_MERCHANT_ID'
  ]

  return requiredVars.every(varName => {
    const value = process.env[varName]
    return value && value.trim() !== ''
  })
}

// Payment channels configuration
export const PAYMENT_CHANNELS = {
  ALL: '0',
  CREDIT_CARD: '1',
  FPX: '2',
  BANK_TRANSFER: '3',
  E_WALLET: '4'
} as const

// Error messages
export const TOYYIBPAY_ERRORS = {
  CONFIG_MISSING: 'ToyyibPay configuration is missing. Please contact support.',
  INVALID_AMOUNT: 'Invalid payment amount.',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  INVALID_RESPONSE: 'Invalid response from payment gateway.'
} as const
