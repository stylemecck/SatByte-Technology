import { Project } from '../models/Project.js'
import { deleteImage, uploadImageBuffer } from '../config/cloudinary.js'

export async function listProjects(_req, res) {
  try {
    const items = await Project.find().sort({ createdAt: -1 }).lean()
    res.json(items)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to list projects' })
  }
}

export async function getProject(req, res) {
  try {
    const doc = await Project.findById(req.params.id).lean()
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to load project' })
  }
}

export async function createProject(req, res) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'Image file is required (field name: image)' })
    }
    const { title, description, technologies, category } = req.body
    if (!title || !description) {
      return res.status(400).json({ message: 'title and description are required' })
    }
    let techList = []
    if (typeof technologies === 'string') {
      try {
        techList = JSON.parse(technologies)
      } catch {
        techList = technologies.split(',').map((t) => t.trim()).filter(Boolean)
      }
    } else if (Array.isArray(technologies)) {
      techList = technologies
    }

    const { secure_url, public_id } = await uploadImageBuffer(req.file.buffer, 'projects')

    const doc = await Project.create({
      title,
      description,
      imageUrl: secure_url,
      cloudinaryPublicId: public_id,
      technologies: techList,
      category: category && ['Web', 'E-commerce', 'Software', 'Other'].includes(category) ? category : 'Web',
    })
    res.status(201).json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e.message || 'Failed to create project' })
  }
}

export async function updateProject(req, res) {
  try {
    const doc = await Project.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })

    const { title, description, technologies, category } = req.body
    if (title) doc.title = title
    if (description) doc.description = description
    if (category && ['Web', 'E-commerce', 'Software', 'Other'].includes(category)) {
      doc.category = category
    }
    if (technologies !== undefined) {
      let techList = []
      if (typeof technologies === 'string') {
        try {
          techList = JSON.parse(technologies)
        } catch {
          techList = technologies.split(',').map((t) => t.trim()).filter(Boolean)
        }
      } else if (Array.isArray(technologies)) {
        techList = technologies
      }
      doc.technologies = techList
    }

    if (req.file?.buffer) {
      await deleteImage(doc.cloudinaryPublicId)
      const { secure_url, public_id } = await uploadImageBuffer(req.file.buffer, 'projects')
      doc.imageUrl = secure_url
      doc.cloudinaryPublicId = public_id
    }

    await doc.save()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e.message || 'Failed to update project' })
  }
}

export async function removeProject(req, res) {
  try {
    const doc = await Project.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    await deleteImage(doc.cloudinaryPublicId)
    await doc.deleteOne()
    res.json({ message: 'Deleted' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to delete project' })
  }
}
