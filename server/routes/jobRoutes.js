import { Router } from 'express'
import { 
  getAllJobs, 
  getJobById, 
  applyForJob, 
  createJob, 
  getAllApplications,
  getMyApplications
} from '../controllers/jobController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllJobs)
router.get('/:id', getJobById)
router.get('/my/applications', requireAuth, getMyApplications)
router.post('/apply', requireAuth, applyForJob)

// Admin only
router.post('/', requireAdmin, createJob)
router.get('/admin/applications', requireAdmin, getAllApplications)

export default router
