import { Router } from 'express'
import {
  createBlog,
  getBlog,
  listBlogs,
  removeBlog,
  updateBlog,
} from '../controllers/blogController.js'
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

router.get('/', listBlogs)
router.get('/slug/:slug', getBlog)
router.post('/', requireAuth, requireAdmin, runUpload, createBlog)
router.put('/:id', requireAuth, requireAdmin, optionalUpload, updateBlog)
router.delete('/:id', requireAuth, requireAdmin, removeBlog)

export default router
