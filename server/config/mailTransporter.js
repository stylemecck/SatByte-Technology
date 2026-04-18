import axios from 'axios';
import { wrapEmail } from './emailTemplate.js'
import { generateInvoiceBuffer } from '../utils/invoiceGenerator.js'

/**
 * Custom mail transporter that mimics nodemailer's sendMail signature
 * but uses Resend's REST API to bypass Render's SMTP port blocks.
 */
export const mailTransporter = {
  sendMail: async (options) => {
    try {
      // Use env var or the fallback token provided previously
      const resendApiKey = process.env.RESEND_API_KEY?.trim() || 're_JnYFtcut_BCJXZotm5RCwpKYiSvRvqLDv';
      
      // Resend requires verified sending domains.
      // Your satbyte.in domain is verified, so we use it here.
      const payload = {
        from: 'SatByte Technologies <info@satbyte.in>', 
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      // Handle attachments if present
      if (options.attachments && options.attachments.length > 0) {
        payload.attachments = options.attachments.map(att => ({
          filename: att.filename,
          content: Buffer.isBuffer(att.content) ? att.content.toString('base64') : att.content
        }));
      }

      console.log(`[mail] Attempting delivery via Resend to ${options.to}...`);

      const response = await axios.post('https://api.resend.com/emails', payload, {
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('[mail] Resend API success, id:', response.data.id);
      return { messageId: response.data.id };

    } catch (e) {
        const errorData = e.response?.data || e.message;
        console.error('[mail] Resend API Error Details:', JSON.stringify(errorData, null, 2));
        
        // If it's a domain verification issue, log a helpful warning
        if (e.response?.status === 403 || e.response?.status === 422) {
          console.error('[mail] Delivery failed. This usually means the sender domain is not verified in Resend or the API key is invalid.');
        }
        
        throw new Error(typeof errorData === 'object' ? (errorData.message || 'Mail delivery failed') : errorData);
    }
  }
};

export const sendPurchaseConfirmation = async (userEmail, planName, referenceNumber, gatewayReference, amountTotal) => {
  try {
    // Correctly call the modernized invoice generator with an object
    const invoiceBuffer = await generateInvoiceBuffer({
      planName,
      emailReferenceId: referenceNumber,
      amountPaid: amountTotal || 0,
      email: userEmail,
      paymentGatewayReferenceId: gatewayReference || 'N/A',
      createdAt: new Date()
    });

    const mailOptions = {
      from: `"SatByte Technologies" <info@satbyte.in>`,
      to: userEmail,
      subject: `Payment Confirmation - ${planName} | SatByte Technologies`,
      attachments: [
        {
          filename: `Invoice-${referenceNumber}.pdf`,
          content: invoiceBuffer,
          contentType: 'application/pdf'
        }
      ],
      html: wrapEmail(
        'Payment Received',
        `
          <h1>Thank You for Your Purchase!</h1>
          <p>Your payment for <strong class="accent">${planName}</strong> has been successfully processed.</p>
          
          <div class="meta-box">
            <p><strong>Order Reference:</strong> ${referenceNumber}</p>
            <p><strong>Gateway ID:</strong> ${gatewayReference || 'N/A'}</p>
            <p><strong>Amount Paid:</strong> INR ${(amountTotal / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <p><strong>Next Steps:</strong> We have attached your official PDF invoice to this email. A project manager will reach out to you within 24 hours to begin the onboarding process.</p>
          
          <p>Welcome to the future of digital engineering. We're excited to build something great together.</p>
        `,
        'Go to Dashboard',
        'https://satbyte.in/portal'
      ),
    };

    const info = await mailTransporter.sendMail(mailOptions);
    console.log('[mail] Purchase confirmation sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('[mail] Purchase confirmation failed:', error.message);
    throw error;
  }
};
