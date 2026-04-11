import { Router } from 'express'
import { 
  getAllCertifications, 
  getCertificationById, 
  createCertification,
  createEnrollmentSession,
  verifyEnrollment,
  getMyEnrollments,
  updateCertification,
  deleteCertification
} from '../controllers/certificationController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllCertifications)
router.get('/:id', getCertificationById)
router.get('/my/enrollments', requireAuth, getMyEnrollments)
router.post('/enroll', requireAuth, createEnrollmentSession)
router.post('/verify', requireAuth, verifyEnrollment)

// Admin only
router.post('/', requireAdmin, createCertification)
router.put('/:id', requireAdmin, updateCertification)
router.delete('/:id', requireAdmin, deleteCertification)

export default router
