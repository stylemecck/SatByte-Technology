import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const sendPurchaseConfirmation = async (userEmail, planName, referenceNumber, gatewayReference) => {
  const mailOptions = {
    from: `"SatByte Technologies" <${process.env.GMAIL_USER}>`,
    to: userEmail,
    subject: `Payment Confirmation - ${planName} | SatByte Technologies`,
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};
