import { Internship } from '../models/Internship.js'
import { Application } from '../models/Application.js'

/** Public: List all open internships */
export async function getAllInternships(req, res) {
  try {
    const internships = await Internship.find({ status: 'Open' }).sort({ createdAt: -1 })
    res.json(internships)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch internships' })
  }
}

/** Public: Get single internship details */
export async function getInternshipById(req, res) {
  try {
    const internship = await Internship.findById(req.params.id)
    if (!internship) return res.status(404).json({ message: 'Internship not found' })
    res.json(internship)
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch internship details' })
  }
}

/** Authenticated: Apply for an internship */
export async function applyForInternship(req, res) {
  try {
    const { internshipId, resumeUrl, coverLetter, college, course, skills } = req.body
    const userId = req.user.id

    const application = await Application.create({
      user: userId,
      internship: internshipId,
      type: 'Internship',
      resumeUrl,
      coverLetter,
      college,
      course,
      skills
    })

    res.status(201).json({ message: 'Internship application submitted successfully', application })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Failed to submit application' })
  }
}

/** Admin: Post new internship */
export async function createInternship(req, res) {
  try {
    const internship = await Internship.create(req.body)
    res.status(201).json(internship)
  } catch (e) {
    res.status(500).json({ message: 'Failed to create internship' })
  }
}

/** Admin: Update internship */
export async function updateInternship(req, res) {
  try {
    const intern = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!intern) return res.status(404).json({ message: 'Internship not found' })
    res.json(intern)
  } catch (e) {
    res.status(500).json({ message: 'Failed to update internship' })
  }
}

/** Admin: Delete internship */
export async function deleteInternship(req, res) {
  try {
    const intern = await Internship.findByIdAndDelete(req.params.id)
    if (!intern) return res.status(404).json({ message: 'Internship not found' })
    res.json({ message: 'Internship deleted successfully' })
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete internship' })
  }
}
