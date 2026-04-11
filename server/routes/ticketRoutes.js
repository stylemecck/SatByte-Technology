import { Router } from 'express'
import {
  listTickets,
  createTicket,
  getTicket,
  replyToTicket,
  closeTicket
} from '../controllers/ticketController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// All ticket routes require authentication
router.use(requireAuth)

router.get('/', listTickets)
router.post('/', createTicket)
router.get('/:id', getTicket)
router.post('/:id/reply', replyToTicket)
router.put('/:id/close', closeTicket)

export default router
