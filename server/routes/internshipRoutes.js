import { Router } from 'express'
import { 
  getAllInternships, 
  getInternshipById, 
  applyForInternship, 
  createInternship 
} from '../controllers/internshipController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllInternships)
router.get('/:id', getInternshipById)
router.post('/apply', requireAuth, applyForInternship)

// Admin only
router.post('/', requireAdmin, createInternship)

export default router
