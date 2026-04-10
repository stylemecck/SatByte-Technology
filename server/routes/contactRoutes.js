import { Router } from 'express'
import { sendContact, submitEstimate } from '../controllers/contactController.js'

const router = Router()
router.post('/', sendContact)
router.post('/estimate', submitEstimate)

export default router
