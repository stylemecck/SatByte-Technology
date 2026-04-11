import { Router } from 'express'
import {
  createProject,
  getProject,
  listProjects,
  removeProject,
  updateProject,
} from '../controllers/projectController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { uploadSingleImage } from '../middleware/upload.js'

const router = Router()

function runUpload(req, res, next) {
  uploadSingleImage(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload failed' })
    next()
  })
}

/** JSON-only updates skip multer; multipart sends optional new image. */
function optionalUpload(req, res, next) {
  const ct = req.headers['content-type'] || ''
  if (!ct.includes('multipart/form-data')) return next()
  return runUpload(req, res, next)
}

router.get('/', listProjects)
router.get('/:id', getProject)
router.post('/', requireAuth, requireAdmin, runUpload, createProject)
router.put('/:id', requireAuth, requireAdmin, optionalUpload, updateProject)
router.delete('/:id', requireAuth, requireAdmin, removeProject)

export default router
