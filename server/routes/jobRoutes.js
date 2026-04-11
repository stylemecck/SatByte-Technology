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
router.post('/', requireAdmin, createJob)
router.put('/:id', requireAdmin, updateJob)
router.delete('/:id', requireAdmin, deleteJob)
router.get('/admin/applications', requireAdmin, getAllApplications)
router.put('/applications/:id/status', requireAdmin, updateApplicationStatus)

export default router
