import mongoose from 'mongoose'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { Job } from './models/Job.js'
import { Internship } from './models/Internship.js'
import { Certification } from './models/Certification.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '.env') })

const MONGODB_URI = process.env.MONGODB_URI

async function seed() {
  await mongoose.connect(MONGODB_URI)
  
  // Clear existing
  await Job.deleteMany({})
  await Internship.deleteMany({})
  await Certification.deleteMany({})

  // Seed Jobs
  await Job.create([
    {
      title: 'Full Stack Developer (MERN)',
      description: 'We are looking for a rockstar MERN stack developer to join our core team. You will be responsible for building scalable web applications and participating in architectural decisions.',
      requirements: ['3+ years experience with React and Node.js', 'Strong understanding of MongoDB', 'Experience with AWS/Render deployment'],
      responsibilities: ['Develop new user-facing features', 'Build reusable code and libraries', 'Optimize applications for maximum speed and scalability'],
      location: 'Remote / Mahua',
      experience: '3-5 Years',
      category: 'Engineering',
      type: 'Full-time'
    },
    {
      title: 'UI/UX Designer',
      description: 'Design beautiful, intuitive interfaces for our global clients. You should have a strong portfolio showcasing modern dark-mode aesthetics and glassmorphism.',
      requirements: ['Proficiency in Figma', 'Understanding of React/Tailwind is a plus', 'Strong eye for typography'],
      responsibilities: ['Create wireframes and prototypes', 'Collaborate with developers', 'Maintain our design system'],
      location: 'Remote',
      experience: '1-3 Years',
      category: 'Design',
      type: 'Contract'
    }
  ])

  // Seed Internships
  await Internship.create([
    {
      title: 'Frontend Development Intern',
      description: 'Learn to build modern UIs using React and Tailwind CSS. You will work alongside senior developers on real client projects.',
      duration: '6 Months',
      stipend: '₹5,000 - ₹8,000 / month',
      requirements: ['Basic knowledge of HTML/CSS/JS', 'Eagerness to learn React', 'Good communication skills'],
      location: 'Remote',
      skills: ['React', 'Tailwind CSS', 'Framer Motion'],
      status: 'Open'
    },
    {
      title: 'Backend Engineering Intern',
      description: 'Explore the world of Node.js, Express, and MongoDB. Learn how to build secure and fast APIs.',
      duration: '3 Months',
      stipend: '₹4,000 / month',
      requirements: ['Basic Node.js knowledge', 'Understanding of REST APIs'],
      location: 'Remote',
      skills: ['Node.js', 'Express', 'MongoDB'],
      status: 'Open'
    }
  ])

  // Seed Certifications
  await Certification.create([
    {
      title: 'Mastering MERN Stack',
      description: 'A comprehensive 3-month program taking you from zero to a job-ready full stack developer.',
      price: 4999,
      duration: '12 Weeks',
      features: ['Live Mentorship', '10+ Real Projects', 'Job Placement Support', 'Verified Certificate'],
      syllabus: ['React Fundamentals', 'Node.js & Express', 'MongoDB Deep Dive', 'Deployment & CI/CD'],
      status: 'Active'
    },
    {
       title: 'Advanced UI/UX with Figma',
       description: 'Learn the secrets of modern web design, from layout theory to advanced prototyping.',
       price: 2999,
       duration: '6 Weeks',
       features: ['Project Reviews', 'Portfolio Building', 'Access to UI Kits'],
       syllabus: ['Design Principles', 'Figma Mastery', 'Prototyping', 'Design Systems'],
       status: 'Active'
    }
  ])

  console.log('Seeding complete!')
  process.exit(0)
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
