import multer from 'multer'

const storage = multer.memoryStorage()

/** Single image field for Cloudinary pipeline (buffer in memory). */
export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'))
    }
    cb(null, true)
  },
}).single('image')
