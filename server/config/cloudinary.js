/**
 * Cloudinary SDK setup + helpers: upload buffers, delete assets, default optimizations.
 * Credentials come from environment variables only.
 */
import { v2 as cloudinary } from 'cloudinary'

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn(
    '[cloudinary] Missing CLOUDINARY_* env vars — image upload routes will fail until configured.',
  )
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
})

/** Default delivery optimizations applied on upload (auto format/quality). */
const DEFAULT_UPLOAD_TRANSFORMATION = [
  { fetch_format: 'auto', quality: 'auto' },
]

/**
 * Upload an image buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder — logical folder under `satbyte/`
 * @param {string} [publicId] — optional custom public id suffix
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export function uploadImageBuffer(buffer, folder, publicId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `satbyte/${folder}`,
        resource_type: 'image',
        overwrite: true,
        transformation: DEFAULT_UPLOAD_TRANSFORMATION,
        ...(publicId ? { public_id: publicId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) } : {}),
      },
      (err, result) => {
        if (err) return reject(err)
        if (!result?.secure_url || !result?.public_id) {
          return reject(new Error('Cloudinary upload returned no URL'))
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      },
    )
    uploadStream.end(buffer)
  })
}

/**
 * Upload any file buffer to Cloudinary (image, pdf, zip).
 */
export function uploadAnyFileBuffer(buffer, folder, originalFilename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `satbyte/${folder}`,
        resource_type: 'auto', // Auto-detects raw vs image
        public_id: originalFilename ? originalFilename.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50) + '_' + Date.now() : undefined,
      },
      (err, result) => {
        if (err) return reject(err)
        if (!result?.secure_url || !result?.public_id) {
          return reject(new Error('Cloudinary upload returned no URL'))
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id })
      },
    )
    // For non-image types, we might need to tell cloudinary the exact filename to determine resource_type properly,
    // actually `auto` handles it.
    uploadStream.end(buffer)
  })
}


/**
 * Remove an image from Cloudinary by public_id (stored in MongoDB).
 * @param {string} publicId
 */
export async function deleteImage(publicId) {
  if (!publicId) return { result: 'noop' }
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

/**
 * Remove any file from Cloudinary (need to try raw, or auto isn't supported for destroy).
 */
export async function deleteAnyFile(publicId, isImage = false) {
  if (!publicId) return { result: 'noop' }
  return cloudinary.uploader.destroy(publicId, { resource_type: isImage ? 'image' : 'raw' })
}

/**
 * Build a transformed delivery URL (responsive width, auto format/quality).
 * Use on backend when you want to return a variant, or mirror logic on the client.
 * @param {string} publicId
 * @param {{ width?: number }} opts
 */
export function optimizedUrlFromPublicId(publicId, { width = 800 } = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { width, crop: 'limit' },
      { fetch_format: 'auto', quality: 'auto' },
    ],
  })
}

export { cloudinary }
