export type ProjectDTO = {
  _id: string
  title: string
  description: string
  imageUrl: string
  cloudinaryPublicId: string
  technologies: string[]
  category: string
  createdAt: string
  updatedAt: string
}

export type BlogDTO = {
  _id: string
  title: string
  content: string
  imageUrl: string
  cloudinaryPublicId: string
  slug: string
  excerpt: string
  readTime: string
  author?: string
  category?: string
  createdAt: string
  updatedAt: string
}

export type ServiceDTO = {
  _id: string
  title: string
  description: string
  iconUrl: string
  cloudinaryPublicId: string
  iconKey: string
  createdAt: string
  updatedAt: string
}

export type OrderDTO = {
  _id: string
  email: string
  planKey: string
  planName: string
  amountPaid: number
  paymentGatewayReferenceId: string
  emailReferenceId: string
  customerName: string
  status: string
  projectStatus?: string
  progress?: number
  createdAt: string
  updatedAt: string
}
