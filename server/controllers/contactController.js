import nodemailer from 'nodemailer'
import { wrapEmail } from '../config/emailTemplate.js'

/**
 * Optional contact endpoint using Nodemailer (configure SMTP_* in .env).
 */
export async function sendContact(req, res) {
  try {
    const { name, email, phone, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'name, email, and message are required' })
    }

    const host = process.env.SMTP_HOST
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER

    if (!host || !user || !pass || !to) {
      return res.status(503).json({
        message: 'Email is not configured on the server (set SMTP_* and CONTACT_TO_EMAIL).',
      })
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    })

    const html = wrapEmail(
      `New Message from ${name}`,
      `
        <h1>New Contact Request</h1>
        <p>You have received a new message from your website contact form.</p>
        <div class="meta-box">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || '—'}</p>
        </div>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
      'View Dashboard',
      'https://satbyte.in/portal'
    )

    await transporter.sendMail({
      from: `"SatByte Site" <${user}>`,
      to,
      replyTo: email,
      subject: `[SatByte Contact] ${name}`,
      html,
    })

    res.json({ message: 'Sent' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to send email' })
  }
}

export async function submitEstimate(req, res) {
  try {
    const { projectType, pages, timeline, estimate, email } = req.body
    if (!email || !projectType) {
      return res.status(400).json({ message: 'Email and project type are required' })
    }

    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASS

    if (!user || !pass) {
      return res.status(503).json({ message: 'GMAIL is not configured on the server.' })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })

    const html = wrapEmail(
      'New Project Estimate',
      `
        <h1>Project Estimate Request</h1>
        <p>A potential client has requested a personalized estimate for their project.</p>
        <div class="meta-box">
          <p><strong>Client Email:</strong> ${email}</p>
          <p><strong>Project Type:</strong> ${projectType}</p>
          <p><strong>Pages Needed:</strong> ${pages || 'Not specified'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
          <p style="font-size: 20px; color: #00e5ff; font-weight: 800; margin-top: 10px;">
            Calculated Estimate: ${estimate}
          </p>
        </div>
        <p>This estimate is based on the current pricing parameters. You may want to follow up with the client to finalize the project scope.</p>
      `,
      'Contact Client',
      `mailto:${email}`
    )

    // Send to Admin
    await transporter.sendMail({
      from: `"SatByte Site" <${user}>`,
      to: user,
      replyTo: email,
      subject: `[New Lead] Estimate Request from ${email}`,
      html,
    })

    res.json({ message: 'Estimate sent successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to send estimate email' })
  }
}
