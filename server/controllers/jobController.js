import { Job } from '../models/Job.js'
import { Application } from '../models/Application.js'

/** Public: List all open jobs */
export async function getAllJobs(req, res) {
  try {
    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 })
    res.json(jobs)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch jobs' })
  }
}

/** Public: Get single job details */
export async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(job)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch job details' })
  }
}

/** Authenticated: Apply for a job */
export async function applyForJob(req, res) {
  try {
    const { jobId, resumeUrl, coverLetter, skills } = req.body
    const userId = req.user.id // Assuming id is the userId from JWT

    const application = await Application.create({
      user: userId,
      job: jobId,
      type: 'Job',
      resumeUrl,
      coverLetter,
      skills
    })

    res.status(201).json({ message: 'Application submitted successfully', application })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to submit application' })
  }
}

/** Admin: Post new job */
export async function createJob(req, res) {
  try {
    const job = await Job.create(req.body)
    res.status(201).json(job)
  } catch (e) {
    res.status(500).json({ message: 'Failed to create job' })
  }
}

/** Admin: Update existing job */
export async function updateJob(req, res) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json(job)
  } catch (e) {
    res.status(500).json({ message: 'Failed to update job' })
  }
}

/** Admin: Delete job */
export async function deleteJob(req, res) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })
    res.json({ message: 'Job deleted successfully' })
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete job' })
  }
}

/** Admin: Update Application Status */
export async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body
    const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!app) return res.status(404).json({ message: 'Application not found' })
    res.json(app)
  } catch (e) {
    res.status(500).json({ message: 'Failed to update status' })
  }
}

/** Admin: View all applications */
export async function getAllApplications(req, res) {
  try {
    const apps = await Application.find()
      .populate('user', 'name email')
      .populate('job', 'title')
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
    res.json(apps)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch applications' })
  }
}

/** Authenticated: View user's own applications */
export async function getMyApplications(req, res) {
  try {
    const userId = req.user.id
    const apps = await Application.find({ user: userId })
      .populate('job', 'title')
      .populate('internship', 'title')
      .sort({ createdAt: -1 })
    res.json(apps)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to fetch your applications' })
  }
}

