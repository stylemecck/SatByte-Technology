import { Router } from 'express'
import {
  createService,
  listServices,
  removeService,
  updateService,
} from '../controllers/serviceController.js'
import { requireAuth } from '../middleware/auth.js'
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

router.get('/', listServices)
router.post('/', requireAuth, runUpload, createService)
router.put('/:id', requireAuth, optionalUpload, updateService)
router.delete('/:id', requireAuth, removeService)

export default router
