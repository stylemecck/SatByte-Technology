import PDFDocument from 'pdfkit';
import { wrapEmail } from './emailTemplate.js'

const BRAND_BLUE = '#2563EB'
const BRAND_DARK = '#0F172A'
const BRAND_MID  = '#475569'
const BRAND_LIGHT = '#F1F5F9'

const generateInvoiceBuffer = (planName, referenceNumber, amountTotal) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 0, size: 'A4' })
    const buffers = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => resolve(Buffer.concat(buffers)))

    const W = doc.page.width   // 595
    const H = doc.page.height  // 842
    const MARGIN = 50

    // ── Header bar ──────────────────────────────────────────────────────
    doc.rect(0, 0, W, 110).fill(BRAND_DARK)

    // Company name
    doc.fontSize(22).fillColor('#FFFFFF').font('Helvetica-Bold')
       .text('SatByte Technology', MARGIN, 32)

    // Tagline
    doc.fontSize(10).fillColor('#94A3B8').font('Helvetica')
       .text('Premium Digital Engineering Solutions', MARGIN, 58)

    // "INVOICE" badge (right side of header)
    doc.roundedRect(W - 150, 28, 100, 34, 6).fill(BRAND_BLUE)
    doc.fontSize(13).fillColor('#FFFFFF').font('Helvetica-Bold')
       .text('INVOICE', W - 150, 38, { width: 100, align: 'center' })

    // ── Blue accent line under header ────────────────────────────────
    doc.rect(0, 110, W, 4).fill(BRAND_BLUE)

    // ── Meta row (Invoice # | Date | Status) ─────────────────────────
    const metaY = 135
    doc.fontSize(9).fillColor(BRAND_MID).font('Helvetica')

    // Invoice number
    doc.text('INVOICE NUMBER', MARGIN, metaY)
    doc.fontSize(12).fillColor(BRAND_DARK).font('Helvetica-Bold')
       .text(referenceNumber, MARGIN, metaY + 14)

    // Date
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    doc.fontSize(9).fillColor(BRAND_MID).font('Helvetica')
       .text('DATE ISSUED', 230, metaY)
    doc.fontSize(12).fillColor(BRAND_DARK).font('Helvetica-Bold')
       .text(dateStr, 230, metaY + 14)

    // Status badge
    doc.roundedRect(W - MARGIN - 80, metaY + 6, 80, 24, 4).fill('#DCFCE7')
    doc.fontSize(11).fillColor('#15803D').font('Helvetica-Bold')
       .text('✓  PAID', W - MARGIN - 80, metaY + 12, { width: 80, align: 'center' })

    // ── Divider ────────────────────────────────────────────────────────
    doc.moveTo(MARGIN, metaY + 50).lineTo(W - MARGIN, metaY + 50)
       .strokeColor('#E2E8F0').lineWidth(1).stroke()

    // ── Billed To / From columns ───────────────────────────────────────
    const billedY = metaY + 68

    doc.fontSize(9).fillColor(BRAND_BLUE).font('Helvetica-Bold')
       .text('FROM', MARGIN, billedY)
    doc.fontSize(11).fillColor(BRAND_DARK).font('Helvetica-Bold')
       .text('SatByte Technology', MARGIN, billedY + 14)
    doc.fontSize(9).fillColor(BRAND_MID).font('Helvetica')
       .text('Mahua, Vaishali, Bihar – 844506', MARGIN, billedY + 29)
       .text('info@satbyte.in', MARGIN, billedY + 43)
       .text('satbyte.in', MARGIN, billedY + 57)

    doc.fontSize(9).fillColor(BRAND_BLUE).font('Helvetica-Bold')
       .text('BILLED TO', 300, billedY)
    doc.fontSize(11).fillColor(BRAND_DARK).font('Helvetica-Bold')
       .text('Valued Client', 300, billedY + 14)
    doc.fontSize(9).fillColor(BRAND_MID).font('Helvetica')
       .text('Please retain this invoice for your records.', 300, billedY + 29)

    // ── Item table header ──────────────────────────────────────────────
    const tableY = billedY + 100
    doc.rect(MARGIN, tableY, W - MARGIN * 2, 28).fill(BRAND_DARK)

    doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica-Bold')
       .text('DESCRIPTION', MARGIN + 12, tableY + 10)
       .text('QTY', 380, tableY + 10, { width: 60, align: 'center' })
       .text('AMOUNT', 450, tableY + 10, { width: 90, align: 'right' })

    // ── Item row ───────────────────────────────────────────────────────
    const rowY = tableY + 28
    doc.rect(MARGIN, rowY, W - MARGIN * 2, 44).fill(BRAND_LIGHT)

    doc.fontSize(11).fillColor(BRAND_DARK).font('Helvetica-Bold')
       .text(planName, MARGIN + 12, rowY + 8)
    doc.fontSize(9).fillColor(BRAND_MID).font('Helvetica')
       .text('Website development package – one-time payment', MARGIN + 12, rowY + 24)

    doc.fontSize(11).fillColor(BRAND_DARK).font('Helvetica-Bold')
       .text('1', 380, rowY + 16, { width: 60, align: 'center' })

    const amountStr = `INR ${(amountTotal / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    doc.fontSize(11).fillColor(BRAND_DARK).font('Helvetica-Bold')
       .text(amountStr, 450, rowY + 16, { width: 90, align: 'right' })

    // ── Totals block ───────────────────────────────────────────────────
    const totalsY = rowY + 60
    const totalsX = W - MARGIN - 220

    // Subtotal row
    doc.moveTo(totalsX, totalsY).lineTo(W - MARGIN, totalsY)
       .strokeColor('#E2E8F0').lineWidth(1).stroke()
    doc.fontSize(10).fillColor(BRAND_MID).font('Helvetica')
       .text('Subtotal', totalsX, totalsY + 8, { width: 110, align: 'left' })
       .text(amountStr, totalsX + 110, totalsY + 8, { width: 110, align: 'right' })

    // Tax row
    doc.moveTo(totalsX, totalsY + 28).lineTo(W - MARGIN, totalsY + 28)
       .strokeColor('#E2E8F0').lineWidth(0.5).stroke()
    doc.fontSize(10).fillColor(BRAND_MID).font('Helvetica')
       .text('Tax (0%)', totalsX, totalsY + 36, { width: 110 })
       .text('—', totalsX + 110, totalsY + 36, { width: 110, align: 'right' })

    // Total row
    doc.rect(totalsX - 10, totalsY + 55, 220, 34).fill(BRAND_BLUE)
    doc.fontSize(11).fillColor('#FFFFFF').font('Helvetica-Bold')
       .text('TOTAL PAID', totalsX, totalsY + 65, { width: 110 })
       .text(amountStr, totalsX + 110, totalsY + 65, { width: 110, align: 'right' })

    // ── Thank you note ─────────────────────────────────────────────────
    const noteY = totalsY + 110
    doc.roundedRect(MARGIN, noteY, W - MARGIN * 2, 56, 8).fill('#EFF6FF')
    doc.fontSize(11).fillColor(BRAND_BLUE).font('Helvetica-Bold')
       .text('Thank you for choosing SatByte Technology!', MARGIN + 16, noteY + 10)
    doc.fontSize(9).fillColor(BRAND_MID).font('Helvetica')
       .text(
         'A team member will contact you shortly to kick off your project. For any queries, email info@satbyte.in or visit satbyte.in/contact.',
         MARGIN + 16, noteY + 28, { width: W - MARGIN * 2 - 32 }
       )

    // ── Footer bar ─────────────────────────────────────────────────────
    doc.rect(0, H - 48, W, 48).fill(BRAND_DARK)
    doc.fontSize(9).fillColor('#64748B').font('Helvetica')
       .text(
         `© ${now.getFullYear()} SatByte Technology  •  Mahua, Vaishali, Bihar  •  info@satbyte.in  •  satbyte.in`,
         0, H - 30, { width: W, align: 'center' }
       )

    doc.end()
  })
}

/**
 * Custom mail transporter that mimics nodemailer's sendMail signature
 * but uses Resend's REST API to bypass Render's SMTP port blocks.
 */
export const mailTransporter = {
  sendMail: async (options) => {
    try {
      // Use env var or the fallback token you provided
      const resendApiKey = process.env.RESEND_API_KEY?.trim() || 're_JnYFtcut_BCJXZotm5RCwpKYiSvRvqLDv';
      
      // Resend expects attachments as base64 strings
      const attachments = options.attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.isBuffer(att.content) ? att.content.toString('base64') : att.content
      }));

      // Resend requires verified sending domains.
      // We explicitly override the 'from' field to your domain's email
      const payload = {
        from: 'SatByte Technologies <info@satbyte.in>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      if (attachments?.length > 0) {
        payload.attachments = attachments;
      }

      console.log(`[mail] Sending via Resend to ${options.to}...`);

      const response = await axios.post('https://api.resend.com/emails', payload, {
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('[mail] Resend API success, id:', response.data.id);
      return { messageId: response.data.id };

    } catch (e) {
        console.error('[mail] Resend API error:', e.response?.data || e.message);
        throw e;
    }
  }
};

export const sendPurchaseConfirmation = async (userEmail, planName, referenceNumber, gatewayReference, amountTotal) => {
  
  const invoiceBuffer = await generateInvoiceBuffer(planName, referenceNumber, amountTotal || 0);

  const mailOptions = {
    from: `"SatByte Technologies" <${process.env.GMAIL_USER?.trim()}>`,
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

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log('[mail] Confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('[mail] Failed to send confirmation email:', error.message, '| code:', error.code, '| response:', error.response)
    throw error;
  }
};
