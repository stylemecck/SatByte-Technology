import { Service } from '../models/Service.js'
import { deleteImage, uploadImageBuffer } from '../config/cloudinary.js'

export async function listServices(_req, res) {
  try {
    const items = await Service.find().sort({ createdAt: 1 }).lean()
    res.json(items)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to list services' })
  }
}

export async function createService(req, res) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'Icon image required (field name: image)' })
    }
    const { title, description, iconKey } = req.body
    if (!title || !description) {
      return res.status(400).json({ message: 'title and description are required' })
    }
    const { secure_url, public_id } = await uploadImageBuffer(req.file.buffer, 'services')
    const doc = await Service.create({
      title,
      description,
      iconUrl: secure_url,
      cloudinaryPublicId: public_id,
      iconKey: iconKey || 'Globe',
    })
    res.status(201).json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e.message || 'Failed to create service' })
  }
}

export async function updateService(req, res) {
  try {
    const doc = await Service.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    const { title, description, iconKey } = req.body
    if (title) doc.title = title
    if (description) doc.description = description
    if (iconKey) doc.iconKey = iconKey

    if (req.file?.buffer) {
      await deleteImage(doc.cloudinaryPublicId)
      const { secure_url, public_id } = await uploadImageBuffer(req.file.buffer, 'services')
      doc.iconUrl = secure_url
      doc.cloudinaryPublicId = public_id
    }

    await doc.save()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e.message || 'Failed to update service' })
  }
}

export async function removeService(req, res) {
  try {
    const doc = await Service.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    await deleteImage(doc.cloudinaryPublicId)
    await doc.deleteOne()
    res.json({ message: 'Deleted' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to delete service' })
  }
}
