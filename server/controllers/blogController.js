import { Blog } from '../models/Blog.js'
import { deleteImage, uploadImageBuffer } from '../config/cloudinary.js'

export async function listBlogs(_req, res) {
  try {
    const items = await Blog.find().sort({ createdAt: -1 }).lean()
    res.json(items)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to list blogs' })
  }
}

export async function getBlog(req, res) {
  try {
    const doc = await Blog.findOne({ slug: req.params.slug }).lean()
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to load blog' })
  }
}

export async function createBlog(req, res) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'Image file is required (field name: image)' })
    }
    const { title, content, readTime } = req.body
    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' })
    }
    const { secure_url, public_id } = await uploadImageBuffer(req.file.buffer, 'blogs')
    const doc = await Blog.create({
      title,
      content,
      readTime: readTime || '5 min read',
      imageUrl: secure_url,
      cloudinaryPublicId: public_id,
    })
    res.status(201).json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e.message || 'Failed to create blog' })
  }
}

export async function updateBlog(req, res) {
  try {
    const doc = await Blog.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    const { title, content, readTime } = req.body
    if (title) doc.title = title
    if (content) doc.content = content
    if (readTime) doc.readTime = readTime

    if (req.file?.buffer) {
      await deleteImage(doc.cloudinaryPublicId)
      const { secure_url, public_id } = await uploadImageBuffer(req.file.buffer, 'blogs')
      doc.imageUrl = secure_url
      doc.cloudinaryPublicId = public_id
    }

    await doc.save()
    res.json(doc)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: e.message || 'Failed to update blog' })
  }
}

export async function removeBlog(req, res) {
  try {
    const doc = await Blog.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    await deleteImage(doc.cloudinaryPublicId)
    await doc.deleteOne()
    res.json({ message: 'Deleted' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to delete blog' })
  }
}
