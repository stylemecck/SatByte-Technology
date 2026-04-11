import { Router } from 'express'
import { 
  getAllCertifications, 
  getCertificationById, 
  createEnrollmentSession, 
  verifyEnrollment, 
  getMyEnrollments, 
  createCertification 
} from '../controllers/certificationController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllCertifications)
router.get('/:id', getCertificationById)
router.get('/my', requireAuth, getMyEnrollments)
router.post('/enroll', requireAuth, createEnrollmentSession)
router.post('/verify', requireAuth, verifyEnrollment)

// Admin only
router.post('/', requireAdmin, createCertification)

export default router
