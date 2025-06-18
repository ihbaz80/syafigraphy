# ToyyibPay Integration Setup Guide

This guide will help you set up ToyyibPay payment gateway integration for your Arabic calligraphy website.

## Prerequisites

1. **ToyyibPay Merchant Account**: You need to register for a ToyyibPay merchant account at [https://toyyibpay.com](https://toyyibpay.com)

2. **Domain Verification**: Your domain must be verified with ToyyibPay

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# ToyyibPay Configuration
NEXT_PUBLIC_TOYYIBPAY_SECRET_KEY=your-secret-key-here
NEXT_PUBLIC_TOYYIBPAY_CATEGORY_CODE=your-category-code-here
NEXT_PUBLIC_TOYYIBPAY_MERCHANT_ID=your-merchant-id-here
NEXT_PUBLIC_TOYYIBPAY_ENVIRONMENT=sandbox
```

### How to Get These Values:

1. **Secret Key**: Found in your ToyyibPay merchant dashboard under "API Keys"
2. **Category Code**: Create a category in your dashboard and use its code
3. **Merchant ID**: Your unique merchant identifier from ToyyibPay
4. **Environment**: Use 'sandbox' for testing, 'production' for live payments

## ToyyibPay Dashboard Configuration

### 1. Create a Category
- Log into your ToyyibPay merchant dashboard
- Go to "Categories" section
- Create a new category for "Arabic Calligraphy Art"
- Note down the category code

### 2. Configure Callback URLs
Set these URLs in your ToyyibPay dashboard:

- **Return URL**: `https://yourdomain.com/success`
- **Callback URL**: `https://yourdomain.com/api/payment-callback`

### 3. Payment Channels
Enable the payment channels you want to accept:
- Credit/Debit Cards
- FPX (Online Banking)
- E-Wallets
- Bank Transfer

## Testing the Integration

### 1. Sandbox Testing
- Use the sandbox environment for testing
- ToyyibPay provides test cards and accounts
- Test all payment scenarios (success, failure, cancellation)

### 2. Test Cards
Use these test cards for sandbox testing:
- **Visa**: 4111111111111111
- **Mastercard**: 5555555555554444
- **Expiry**: Any future date
- **CVV**: Any 3 digits

## Production Deployment

### 1. Environment Variables
- Change `NEXT_PUBLIC_TOYYIBPAY_ENVIRONMENT` to 'production'
- Use production API keys from ToyyibPay

### 2. Domain Verification
- Ensure your domain is verified with ToyyibPay
- Update callback URLs to production domain

### 3. SSL Certificate
- Ensure your website has a valid SSL certificate
- ToyyibPay requires HTTPS for production

## Payment Flow

1. **Customer adds items to cart**
2. **Customer fills checkout form**
3. **System creates ToyyibPay bill**
4. **Customer redirected to ToyyibPay payment page**
5. **Customer completes payment**
6. **ToyyibPay redirects to success page**
7. **System receives callback and updates order status**

## Error Handling

The integration includes error handling for:
- Missing configuration
- Network errors
- Invalid payment responses
- Payment failures

## Security Considerations

1. **Never expose secret keys in client-side code**
2. **Validate all payment responses**
3. **Use HTTPS in production**
4. **Implement proper error logging**
5. **Store sensitive data securely**

## Support

If you encounter issues:

1. Check ToyyibPay documentation: [https://toyyibpay.com/docs](https://toyyibpay.com/docs)
2. Verify your configuration in the dashboard
3. Test with sandbox environment first
4. Contact ToyyibPay support for technical issues

## File Structure

```
lib/
├── toyyibpay.ts          # ToyyibPay service and utilities
└── CartContext.tsx       # Cart state management

app/
├── checkout/
│   └── page.tsx          # Checkout page with payment form
├── success/
│   └── page.tsx          # Success page after payment
└── api/
    └── payment-callback/
        └── route.ts      # Payment callback handler
```

## Troubleshooting

### Common Issues:

1. **"Configuration missing" error**
   - Check your environment variables
   - Ensure all required variables are set

2. **Payment not processing**
   - Verify your ToyyibPay account is active
   - Check callback URLs are correct
   - Ensure domain is verified

3. **Callback not working**
   - Verify callback URL is accessible
   - Check server logs for errors
   - Ensure proper HTTP status codes

4. **Amount validation errors**
   - Ensure amount is in cents (multiply by 100)
   - Check for decimal precision issues
   - Verify currency format

## Additional Features

The integration supports:
- Multiple payment channels
- Order tracking
- Email notifications
- Payment status updates
- Error logging
- Sandbox/production environments 