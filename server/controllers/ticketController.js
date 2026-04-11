import { Ticket } from '../models/Ticket.js'

export async function listTickets(req, res) {
  try {
    const filters = req.user?.role === 'admin' ? {} : { email: req.user?.email }
    const tickets = await Ticket.find(filters).sort({ updatedAt: -1 }).populate('orderId', 'planName emailReferenceId')
    res.json(tickets)
  } catch (err) {
    console.error('[listTickets]', err)
    res.status(500).json({ message: 'Failed to fetch tickets' })
  }
}

export async function createTicket(req, res) {
  try {
    const { orderId, subject, message } = req.body
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and initial message are required.' })
    }

    // Clients must be authenticated to create a ticket (so req.user.email is set)
    const email = req.user?.email
    if (!email) {
      return res.status(401).json({ message: 'Unauthenticated' })
    }

    const ticket = await Ticket.create({
      orderId: orderId || null,
      email,
      subject,
      messages: [{ sender: 'client', content: message }]
    })

    res.status(201).json(ticket)
  } catch (err) {
    console.error('[createTicket]', err)
    res.status(500).json({ message: 'Failed to create ticket' })
  }
}

export async function getTicket(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    if (req.user?.role !== 'admin' && ticket.email !== req.user?.email) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    res.json(ticket)
  } catch (err) {
    console.error('[getTicket]', err)
    res.status(500).json({ message: 'Failed to get ticket' })
  }
}

export async function replyToTicket(req, res) {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ message: 'Message content is required.' })

    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    if (req.user?.role !== 'admin' && ticket.email !== req.user?.email) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const sender = req.user?.role === 'admin' ? 'admin' : 'client'
    
    ticket.messages.push({ sender, content: message })
    ticket.status = sender === 'admin' ? 'Waiting on Client' : 'Open'
    
    await ticket.save()
    res.json(ticket)
  } catch (err) {
    console.error('[replyToTicket]', err)
    res.status(500).json({ message: 'Failed to reply to ticket' })
  }
}

export async function closeTicket(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' })

    if (req.user?.role !== 'admin' && ticket.email !== req.user?.email) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    ticket.status = 'Closed'
    await ticket.save()
    res.json(ticket)
  } catch (err) {
    console.error('[closeTicket]', err)
    res.status(500).json({ message: 'Failed to close ticket' })
  }
}
