import asyncHandler from 'express-async-handler'
import Contact from '../models/Contact.js'

// @desc    Submit a contact form message
// @route   POST /api/contact
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    res.status(400)
    throw new Error('Please fill all required fields')
  }

  const contact = await Contact.create({ name, email, subject, message })
  res.status(201).json({ message: 'Message received. We will contact you soon!', contact })
})

// @desc    Get all messages (admin)
// @route   GET /api/contact
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 })
  res.json(contacts)
})

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
export const markContactRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404)
    throw new Error('Message not found')
  }
  contact.isRead = true
  await contact.save()
  res.json(contact)
})

// @desc    Delete a message
// @route   DELETE /api/contact/:id
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
  if (!contact) {
    res.status(404)
    throw new Error('Message not found')
  }
  await contact.deleteOne()
  res.json({ message: 'Message removed' })
})
