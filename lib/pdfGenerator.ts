import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentStatus: string
  orderDate: string
  paymentMethod: string
  notes?: string
  invoiceNumber: string
}

export const generateInvoicePDF = async (order: Order): Promise<void> => {
  try {
    // Create a temporary div to render the invoice
    const invoiceDiv = document.createElement('div')
    invoiceDiv.style.position = 'absolute'
    invoiceDiv.style.left = '-9999px'
    invoiceDiv.style.top = '0'
    invoiceDiv.style.width = '800px'
    invoiceDiv.style.backgroundColor = 'white'
    invoiceDiv.style.padding = '40px'
    invoiceDiv.style.fontFamily = 'Arial, sans-serif'
    invoiceDiv.style.fontSize = '12px'
    invoiceDiv.style.lineHeight = '1.4'
    invoiceDiv.style.color = '#000'
    
    // Generate the invoice HTML
    const invoiceHTML = generateInvoiceHTML(order)
    invoiceDiv.innerHTML = invoiceHTML
    
    // Add to document temporarily
    document.body.appendChild(invoiceDiv)
    
    // Convert to canvas
    const canvas = await html2canvas(invoiceDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: invoiceDiv.scrollHeight
    })
    
    // Remove temporary div
    document.body.removeChild(invoiceDiv)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // Download the PDF
    pdf.save(`invoice-${order.invoiceNumber}.pdf`)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

const generateInvoiceHTML = (order: Order): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }
  
  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return subtotal * 0.06 // 6% GST
  }
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
        <div>
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background-color: #d97706; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
              <span style="color: white; font-size: 24px;">🖼️</span>
            </div>
            <div>
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #111827;">Syafigraphy</h1>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Arabic Calligraphy Art Gallery</p>
            </div>
          </div>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 2px 0;">123 Calligraphy Street</p>
            <p style="margin: 2px 0;">Kuala Lumpur, 50000</p>
            <p style="margin: 2px 0;">Malaysia</p>
            <p style="margin: 2px 0;">Phone: +60123456789</p>
            <p style="margin: 2px 0;">Email: info@syafigraphy.com</p>
          </div>
        </div>
        <div style="text-align: right;">
          <h2 style="margin: 0 0 10px 0; font-size: 36px; font-weight: bold; color: #111827;">INVOICE</h2>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 2px 0;"><strong>Invoice #:</strong> ${order.invoiceNumber}</p>
            <p style="margin: 2px 0;"><strong>Order #:</strong> ${order.id}</p>
            <p style="margin: 2px 0;"><strong>Date:</strong> ${formatDate(order.orderDate)}</p>
            <p style="margin: 2px 0;"><strong>Due Date:</strong> ${formatDate(order.orderDate)}</p>
          </div>
        </div>
      </div>
      
      <!-- Bill To Section -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
        <div>
          <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #111827;">Bill To:</h3>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 2px 0; font-weight: 500; color: #111827;">${order.customerName}</p>
            <p style="margin: 2px 0;">${order.customerAddress}</p>
            <p style="margin: 2px 0;">Email: ${order.customerEmail}</p>
            <p style="margin: 2px 0;">Phone: ${order.customerPhone}</p>
          </div>
        </div>
        <div>
          <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #111827;">Payment Information:</h3>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 2px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p style="margin: 2px 0;"><strong>Payment Status:</strong> 
              <span style="display: inline-block; margin-left: 8px; padding: 2px 8px; font-size: 10px; font-weight: 600; border-radius: 12px; background-color: ${order.paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7'}; color: ${order.paymentStatus === 'paid' ? '#166534' : '#92400e'};">
                ${order.paymentStatus.toUpperCase()}
              </span>
            </p>
            <p style="margin: 2px 0;"><strong>Order Status:</strong> ${order.status}</p>
          </div>
        </div>
      </div>
      
      <!-- Items Table -->
      <div style="margin-bottom: 40px;">
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background-color: #f9fafb; border-bottom: 2px solid #e5e7eb;">
              <th style="text-align: left; padding: 12px; font-weight: 600; color: #111827; font-size: 12px;">Item</th>
              <th style="text-align: right; padding: 12px; font-weight: 600; color: #111827; font-size: 12px;">Quantity</th>
              <th style="text-align: right; padding: 12px; font-weight: 600; color: #111827; font-size: 12px;">Unit Price</th>
              <th style="text-align: right; padding: 12px; font-weight: 600; color: #111827; font-size: 12px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; vertical-align: top;">
                  <div style="display: flex; align-items: center;">
                    <div style="width: 48px; height: 48px; background-color: #f3f4f6; border-radius: 8px; margin-right: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                      🖼️
                    </div>
                    <div>
                      <p style="margin: 0; font-weight: 500; color: #111827; font-size: 12px;">${item.productName}</p>
                      <p style="margin: 0; font-size: 10px; color: #6b7280;">Item #${item.productId}</p>
                    </div>
                  </div>
                </td>
                <td style="padding: 12px; text-align: right; color: #111827; font-size: 12px;">${item.quantity}</td>
                <td style="padding: 12px; text-align: right; color: #111827; font-size: 12px;">RM ${item.price.toFixed(2)}</td>
                <td style="padding: 12px; text-align: right; font-weight: 500; color: #111827; font-size: 12px;">
                  RM ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <!-- Totals -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 250px;">
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span style="color: #6b7280;">Subtotal:</span>
              <span style="color: #111827;">RM ${calculateSubtotal().toFixed(2)}</span>
            </div>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span style="color: #6b7280;">GST (6%):</span>
              <span style="color: #111827;">RM ${calculateTax().toFixed(2)}</span>
            </div>
          </div>
          <div style="border-top: 2px solid #e5e7eb; padding-top: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold;">
              <span style="color: #111827;">Total:</span>
              <span style="color: #111827;">RM ${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      ${order.notes ? `
        <!-- Notes -->
        <div style="margin-bottom: 40px; padding: 16px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #111827; font-size: 14px;">Notes:</h4>
          <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5;">${order.notes}</p>
        </div>
      ` : ''}
      
      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 32px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
          <div>
            <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #111827; font-size: 14px;">Payment Terms:</h4>
            <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
              Payment is due upon receipt of this invoice. Please include the invoice number with your payment.
            </p>
          </div>
          <div>
            <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #111827; font-size: 14px;">Thank You:</h4>
            <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.5;">
              Thank you for choosing Syafigraphy for your calligraphy needs. We appreciate your business!
            </p>
          </div>
        </div>
      </div>
    </div>
  `
} 