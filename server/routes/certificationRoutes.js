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
import { uploadSingleImage } from '../middleware/upload.js'

const router = Router()

function runUpload(req, res, next) {
  uploadSingleImage(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' })
    next()
  })
}

function optionalUpload(req, res, next) {
  const ct = req.headers['content-type'] || ''
  if (!ct.includes('multipart/form-data')) return next()
  return runUpload(req, res, next)
}

router.get('/', getAllCertifications)
router.get('/:id', getCertificationById)
router.get('/my/enrollments', requireAuth, getMyEnrollments)
router.post('/enroll', requireAuth, createEnrollmentSession)
router.post('/verify', requireAuth, verifyEnrollment)

// Admin only
router.post('/', requireAuth, requireAdmin, runUpload, createCertification)
router.put('/:id', requireAuth, requireAdmin, optionalUpload, updateCertification)
router.delete('/:id', requireAuth, requireAdmin, deleteCertification)

export default router
