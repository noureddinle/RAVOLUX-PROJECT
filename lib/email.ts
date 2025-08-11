import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailTemplates = {
    orderConfirmation: (orderData: any) => ({
      subject: `Order Confirmation - Order #${orderData.order_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank you for your order!</h1>
          <p>Dear ${orderData.customer_name},</p>
          <p>Your order has been successfully placed and is being processed.</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${orderData.order_number}</p>
            <p><strong>Total Amount:</strong> $${orderData.total_amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${orderData.payment_method}</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Items Ordered:</h3>
            ${orderData.items.map((item: any) => `
              <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                <p><strong>${item.product_name}</strong></p>
                <p>Quantity: ${item.quantity} × $${item.unit_price.toFixed(2)} = $${item.total_price.toFixed(2)}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Delivery Address:</h3>
            <p>${orderData.delivery_address.street}<br>
            ${orderData.delivery_address.city}, ${orderData.delivery_address.state} ${orderData.delivery_address.postal_code}<br>
            ${orderData.delivery_address.country}</p>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for choosing us!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this email.
              <br>If you have any questions, contact us at support@yourwebsite.com
            </p>
          </div>
        </div>
      `,
    }),
  
    orderStatusUpdate: (orderData: any, newStatus: string) => ({
      subject: `Order Update - Order #${orderData.order_number} is ${newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Order Status Update</h1>
          <p>Dear ${orderData.customer_name},</p>
          <p>Your order status has been updated to: <strong style="color: #2563eb;">${newStatus.toUpperCase()}</strong></p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <p><strong>Order Number:</strong> ${orderData.order_number}</p>
            <p><strong>Status:</strong> ${newStatus}</p>
            ${newStatus === 'shipped' ? `
              <p><strong>Tracking Information:</strong> Your package is on its way!</p>
            ` : ''}
          </div>
          
          <p>Thank you for your patience!</p>
        </div>
      `,
    }),
  
    welcomeEmail: (userData: any) => ({
      subject: 'Welcome to Our Store!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome aboard, ${userData.name}!</h1>
          <p>Thank you for creating an account with us.</p>
          <p>You can now enjoy:</p>
          <ul>
            <li>Faster checkout</li>
            <li>Order history and tracking</li>
            <li>Exclusive offers and discounts</li>
            <li>Wishlist functionality</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Shopping
            </a>
          </div>
        </div>
      `,
    }),
  
    contactFormResponse: (contactData: any) => ({
      subject: `Thank you for contacting us, ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Thank you for reaching out!</h1>
          <p>Dear ${contactData.name},</p>
          <p>We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="font-style: italic;">"${contactData.message}"</p>
          </div>
          
          <p>Best regards,<br>Customer Support Team</p>
        </div>
      `,
    }),
  
    passwordReset: (resetData: any) => ({
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Password Reset</h1>
          <p>You requested a password reset for your account.</p>
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetData.token}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          <p style="color: #666; font-size: 12px;">
            If the button doesn't work, copy and paste this link: 
            ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetData.token}
          </p>
        </div>
      `,
    }),
  };

  // Email Service Class
export class EmailService {
    static async sendWithResend(to: string, template: { subject: string; html: string }) {
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.FROM_EMAIL || 'noreply@yourwebsite.com',
          to: [to],
          subject: template.subject,
          html: template.html,
        });
  
        if (error) {
          console.error('Resend error:', error);
          throw error;
        }
  
        return { success: true, data };
      } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
      }
    }
    // Main send method (choose your preferred service)
    static async send(to: string, template: { subject: string; html: string }) {
      if (process.env.EMAIL_SERVICE === 'resend') {
        return this.sendWithResend(to, template);
      }
    }   
}