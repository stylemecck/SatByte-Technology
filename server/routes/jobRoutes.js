import { Router } from 'express'
import { 
  getAllJobs, 
  getJobById, 
  applyForJob, 
  createJob, 
  updateJob,
  deleteJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus
} from '../controllers/jobController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllJobs)
router.get('/:id', getJobById)
router.get('/my/applications', requireAuth, getMyApplications)
router.post('/apply', requireAuth, applyForJob)

// Admin only
router.post('/', requireAuth, requireAdmin, createJob)
router.put('/:id', requireAuth, requireAdmin, updateJob)
router.delete('/:id', requireAuth, requireAdmin, deleteJob)
router.get('/admin/applications', requireAuth, requireAdmin, getAllApplications)
router.put('/applications/:id/status', requireAuth, requireAdmin, updateApplicationStatus)

export default router
