import { Router } from 'express'
import { 
  getAllInternships, 
  getInternshipById, 
  applyForInternship, 
  createInternship,
  updateInternship,
  deleteInternship
} from '../controllers/internshipController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllInternships)
router.get('/:id', getInternshipById)
router.post('/apply', requireAuth, applyForInternship)

// Admin only
router.post('/', requireAuth, requireAdmin, createInternship)
router.put('/:id', requireAuth, requireAdmin, updateInternship)
router.delete('/:id', requireAuth, requireAdmin, deleteInternship)

export default router
