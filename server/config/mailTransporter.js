import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

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
       .text('services.satbyte.in', MARGIN, billedY + 57)

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
         'A team member will contact you shortly to kick off your project. For any queries, email info@satbyte.in or visit services.satbyte.in/contact.',
         MARGIN + 16, noteY + 28, { width: W - MARGIN * 2 - 32 }
       )

    // ── Footer bar ─────────────────────────────────────────────────────
    doc.rect(0, H - 48, W, 48).fill(BRAND_DARK)
    doc.fontSize(9).fillColor('#64748B').font('Helvetica')
       .text(
         `© ${now.getFullYear()} SatByte Technology  •  Mahua, Vaishali, Bihar  •  info@satbyte.in  •  services.satbyte.in`,
         0, H - 30, { width: W, align: 'center' }
       )

    doc.end()
  })
}

/**
 * Lazily creates a nodemailer transporter.
 * - Strips any accidental surrounding quotes from GMAIL_APP_PASS
 *   (a common mistake when setting env vars in Render / Heroku dashboards)
 * - Throws a clear error if credentials are missing so logs are actionable
 */
function createMailTransporter() {
  const user = process.env.GMAIL_USER?.trim()
  // Strip surrounding single or double quotes, e.g. "tpuu djin huxf fzio" → tpuu djin huxf fzio
  const pass = process.env.GMAIL_APP_PASS?.trim().replace(/^["']|["']$/g, '')

  if (!user || !pass) {
    throw new Error(
      `[mail] Missing credentials — GMAIL_USER="${user ?? '(unset)'}", GMAIL_APP_PASS=${pass ? '(set)' : '(unset)'}. ` +
      'Set both in your Render environment variables (no surrounding quotes).'
    )
  }

  console.log(`[mail] Transporter ready — user=${user}, pass=${pass.slice(0, 4)}****`)

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS on port 587
    auth: { user, pass },
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 20000,
    socketTimeout: 30000,
    family: 4,
    tls: {
      rejectUnauthorized: false // Helps in some cloud environments with cert issues
    }
  })
}

// Exported singleton — created once on first import
export const mailTransporter = createMailTransporter()

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
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #0ea5e9; margin: 0; font-size: 28px;">SatByte Technologies</h1>
          <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Elevating Your Digital Presence</p>
        </div>
        
        <h2 style="color: #0f172a; margin-top: 0;">Thank You for Your Purchase!</h2>
        
        <p style="font-size: 16px; color: #334155; line-height: 1.5;">
          Your order for <strong>${planName}</strong> has been successfully received. We are thrilled to have you onboard and look forward to delivering exceptional results.
        </p>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a;">
            Order Reference: <strong style="color: #0f172a; font-family: monospace; font-size: 18px;">${referenceNumber}</strong>
          </p>
          <p style="margin: 0; font-size: 14px; color: #475569;">
            Payment Gateway ID: <strong style="color: #475569; font-family: monospace;">${gatewayReference || 'N/A'}</strong>
          </p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #475569;">
            Please keep these reference numbers for any future correspondence regarding your order.
          </p>
        </div>
        
        <p style="font-size: 16px; color: #334155; line-height: 1.5;">
          <strong>Next Steps:</strong> One of our team members will reach out to you shortly to gather any additional requirements and get started on your project.
        </p>
        
        <p style="font-size: 16px; color: #334155; line-height: 1.5;">
          If you have any questions or need immediate assistance, please visit our <a href="https://services.satbyte.in/contact" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">Support Portal</a> or reply directly to this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 35px 0;" />
        
        <div style="text-align: center; font-size: 13px; color: #94a3b8;">
          &copy; ${new Date().getFullYear()} SatByte Technologies. All rights reserved.<br/>
          <a href="https://services.satbyte.in" style="color: #94a3b8; text-decoration: none;">services.satbyte.in</a>
        </div>
      </div>
    `,
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
