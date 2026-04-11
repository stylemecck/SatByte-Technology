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

/** Single file field for Project Assets (documents, zip, pdf) */
export const uploadSingleFile = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    // Allow basic docs, pdfs, zips, and images
    const allowed = [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only PDF, ZIP, DOC, and Images allowed.'))
    }
    cb(null, true)
  },
}).single('file')
