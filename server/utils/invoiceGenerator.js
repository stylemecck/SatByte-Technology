import PDFDocument from 'pdfkit';

const CYAN = '#00E5FF';
const DEEP_BLUE = '#0C1B32';
const TEXT_DARK = '#1E293B';
const TEXT_LIGHT = '#64748B';
const BG_LIGHT = '#F8FAFC';
const BORDER_COLOR = '#E2E8F0';

/**
 * Draws the SatByte Orbit logo using pdfkit vector functions
 */
const drawLogo = (doc, x, y, size = 40) => {
  doc.save();
  doc.translate(x, y);
  
  // Scale factor based on base size 100
  const s = size / 100;
  
  // Orbit Ring (ellipse)
  doc.lineWidth(2.5 * s)
     .strokeColor(DEEP_BLUE)
     .opacity(0.8)
     .ellipse(50 * s, 50 * s, 45 * s, 30 * s)
     .rotate(-15, { origin: [50 * s, 50 * s] })
     .stroke();

  // Reset opacity for the satellite
  doc.opacity(1);
  
  // The Cyan Sphere (Satellite)
  // Positioned at "95, 50" in original 100x100
  // Note: we need to account for the rotation -15 deg applied to the ellipse's group 
  // but for simplicity in PDF we'll just draw it statically on the path
  const satX = 50 * s + 45 * s * Math.cos(Math.PI / 8); // approximate position
  const satY = 50 * s - 30 * s * Math.sin(Math.PI / 8);

  doc.fillColor(CYAN)
     .circle(satX, satY, 5 * s)
     .fill();
     
  // Glow
  doc.fillColor(CYAN).opacity(0.3)
     .circle(satX, satY, 8 * s)
     .fill();

  doc.restore();
};

export const generateInvoiceBuffer = (orderData) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ 
      margin: 0, 
      size: 'A4',
      info: {
        Title: `Invoice ${orderData.emailReferenceId}`,
        Author: 'SatByte Technology',
      }
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    const W = doc.page.width;
    const H = doc.page.height;
    const MARGIN = 50;

    // ── BACKGROUND ACCENT ──
    doc.rect(0, 0, W, 8).fill(DEEP_BLUE);
    doc.rect(0, 8, W, 2).fill(CYAN);

    // ── HEADER ──
    const headerY = 40;
    drawLogo(doc, MARGIN, headerY, 45);
    
    // Company Name Text
    doc.fillColor(DEEP_BLUE).font('Helvetica-Bold').fontSize(24)
       .text('Sat', MARGIN + 55, headerY + 8, { continued: true })
       .fillColor(CYAN).text('Byte');
    
    doc.fillColor(TEXT_LIGHT).font('Helvetica-Bold').fontSize(8)
       .text('TECHNOLOGIES', MARGIN + 56, headerY + 34, { characterSpacing: 2 });

    // INVOICE label (Right)
    doc.fillColor(DEEP_BLUE).font('Helvetica-Bold').fontSize(36)
       .text('INVOICE', W - MARGIN - 200, headerY + 5, { width: 200, align: 'right' });

    // ── INFO ROWS ──
    const infoY = 140;
    
    // Left: From
    doc.fillColor(CYAN).font('Helvetica-Bold').fontSize(10)
       .text('ISSUED BY', MARGIN, infoY);
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(12)
       .text('SatByte Technology', MARGIN, infoY + 15);
    doc.fillColor(TEXT_LIGHT).font('Helvetica').fontSize(9).lineGap(2)
       .text('Mahua, Vaishali, Bihar – 844506', MARGIN, infoY + 32)
       .text('info@satbyte.in | satbyte.in', MARGIN);

    // Right: Metadata
    const metaX = W - MARGIN - 180;
    const drawMetaRow = (label, value, y) => {
      doc.fillColor(TEXT_LIGHT).font('Helvetica').fontSize(9).text(label, metaX, y);
      doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(10).text(value, metaX + 80, y, { width: 100, align: 'right' });
    };

    drawMetaRow('Invoice #:', orderData.emailReferenceId, infoY);
    drawMetaRow('Date:', new Date(orderData.createdAt || Date.now()).toLocaleDateString('en-IN'), infoY + 18);
    drawMetaRow('Payment Method:', orderData.paymentGatewayReferenceId.startsWith('pay_') ? 'Razorpay' : orderData.paymentGatewayReferenceId.startsWith('cs_') ? 'Stripe' : 'Digital Payment', infoY + 36);
    drawMetaRow('Status:', 'PAID', infoY + 54);

    // ── BILLED TO ──
    const billedY = 240;
    doc.rect(MARGIN, billedY, W - (MARGIN * 2), 1).fill(BORDER_COLOR);
    
    doc.fillColor(CYAN).font('Helvetica-Bold').fontSize(10)
       .text('BILLED TO', MARGIN, billedY + 20);
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(14)
       .text(orderData.customerName || 'Valued Client', MARGIN, billedY + 38);
    doc.fillColor(TEXT_LIGHT).font('Helvetica').fontSize(10)
       .text(orderData.email, MARGIN, billedY + 56);

    // ── TABLE ──
    const tableY = 340;
    
    // Header
    doc.rect(MARGIN, tableY, W - (MARGIN * 2), 35).fill(DEEP_BLUE);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(10)
       .text('DESCRIPTION', MARGIN + 15, tableY + 13)
       .text('QTY', W - MARGIN - 150, tableY + 13, { width: 50, align: 'center' })
       .text('TOTAL', W - MARGIN - 80, tableY + 13, { width: 80, align: 'right' });

    // Item Row
    const rowY = tableY + 35;
    doc.rect(MARGIN, rowY, W - (MARGIN * 2), 55).fill(BG_LIGHT);
    
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(12)
       .text(orderData.planName, MARGIN + 15, rowY + 15);
    doc.fillColor(TEXT_LIGHT).font('Helvetica').fontSize(9)
       .text('Premium Digital Engineering & Development Solution', MARGIN + 15, rowY + 32);

    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(11)
       .text('1', W - MARGIN - 150, rowY + 22, { width: 50, align: 'center' });
    
    const amountStr = `INR ${(orderData.amountPaid / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    doc.text(amountStr, W - MARGIN - 80, rowY + 22, { width: 80, align: 'right' });

    // ── TOTALS ──
    const totalBlockY = rowY + 80;
    const totalBlockX = W - MARGIN - 200;

    doc.fillColor(TEXT_LIGHT).font('Helvetica').fontSize(10)
       .text('Subtotal:', totalBlockX, totalBlockY);
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(10)
       .text(amountStr, totalBlockX + 100, totalBlockY, { width: 100, align: 'right' });

    doc.fillColor(TEXT_LIGHT).font('Helvetica').fontSize(10)
       .text('Tax (GST 0%):', totalBlockX, totalBlockY + 20);
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(10)
       .text('₹ 0.00', totalBlockX + 100, totalBlockY + 20, { width: 100, align: 'right' });

    doc.rect(totalBlockX - 10, totalBlockY + 45, 210, 40).fill(DEEP_BLUE);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(12)
       .text('TOTAL PAID', totalBlockX, totalBlockY + 58);
    doc.fontSize(14).text(amountStr, totalBlockX + 80, totalBlockY + 58, { width: 120, align: 'right' });

    // ── DIGITAL SEAL ──
    const sealX = MARGIN;
    const sealY = totalBlockY + 20;
    
    doc.save();
    doc.translate(sealX, sealY);
    // Draw a stylized "Paid" seal
    doc.lineWidth(1.5).strokeColor(CYAN).dash(3, { space: 2 })
       .rect(0, 0, 140, 60).stroke();
    
    doc.font('Helvetica-Bold').fontSize(18).fillColor(CYAN).opacity(0.8)
       .text('OFFICIALLY PAID', 10, 10, { width: 120, align: 'center' });
    doc.fontSize(8).text('Verified via Digital Gateway', 10, 35, { width: 120, align: 'center' });
    doc.fontSize(7).text(orderData.paymentGatewayReferenceId, 10, 45, { width: 120, align: 'center' });
    doc.restore();

    // ── FOOTER ──
    const footerY = H - 100;
    doc.rect(MARGIN, footerY, W - (MARGIN * 2), 1).fill(BORDER_COLOR);
    
    doc.fillColor(TEXT_DARK).font('Helvetica-Bold').fontSize(10)
       .text('Thank you for choosing SatByte Technology.', MARGIN, footerY + 20);
    doc.fillColor(TEXT_LIGHT).font('Helvetica').fontSize(8).lineGap(2)
       .text('This is a computer-generated invoice and does not require a physical signature.', MARGIN, footerY + 35);
    
    doc.fillColor(DEEP_BLUE).font('Helvetica-Bold').fontSize(9)
       .text('www.satbyte.in', W - MARGIN - 100, footerY + 20, { width: 100, align: 'right' });

    doc.end();
  });
};
