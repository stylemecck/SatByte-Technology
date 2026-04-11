export interface User {
  id: string
  email: string
  role: 'admin' | 'client'
  name?: string
  phone?: string
  company?: string
}

export interface Job {
  _id: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  location: string
  experience: string
  salary?: string
  category: string
  type: string
  status: 'Open' | 'Closed'
  createdAt: string
}

export interface Internship {
  _id: string
  title: string
  description: string
  duration: string
  stipend: string
  requirements: string[]
  location: string
  skills: string[]
  status: 'Open' | 'Closed'
  createdAt: string
}

export interface Certification {
  _id: string
  title: string
  description: string
  price: number
  duration: string
  features: string[]
  syllabus: string[]
  imageUrl?: string
  status: 'Active' | 'Inactive'
  createdAt: string
}

export interface Application {
  _id: string
  user: User | string
  job?: Job | string
  internship?: Internship | string
  type: 'Job' | 'Internship'
  resumeUrl: string
  coverLetter: string
  status: 'Pending' | 'Reviewed' | 'Rejected' | 'Hired'
  createdAt: string
}

export interface Enrollment {
  _id: string
  user: User | string
  certification: Certification | string
  status: 'Pending' | 'Completed' | 'Failed'
  amount: number
  paymentId?: string
  certificateUrl?: string
  createdAt: string
}
