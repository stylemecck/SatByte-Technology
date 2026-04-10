import mongoose from 'mongoose'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    excerpt: { type: String, default: '' },
    readTime: { type: String, default: '5 min read' },
    author: { type: String, default: 'SatByte Team' },
    category: { type: String, default: 'Technology' },
  },
  { timestamps: true },
)

blogSchema.pre('save', function (next) {
  if (this.isNew && this.title && !this.slug) {
    this.slug = `${slugify(this.title)}-${Date.now().toString(36)}`
  }
  if (this.isModified('content') && this.content) {
    const plain = this.content.replace(/<[^>]+>/g, '').slice(0, 180)
    this.excerpt = plain.length < this.content.length ? `${plain}…` : plain
  }
  next()
})

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
