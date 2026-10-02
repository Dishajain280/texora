import asyncHandler from 'express-async-handler'
import Testimonial from '../models/Testimonial.js'

export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 })
  res.json(testimonials)
})

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = new Testimonial(req.body)
  const created = await testimonial.save()
  res.status(201).json(created)
})

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id)
  if (!testimonial) {
    res.status(404)
    throw new Error('Testimonial not found')
  }
  Object.assign(testimonial, req.body)
  const updated = await testimonial.save()
  res.json(updated)
})

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id)
  if (!testimonial) {
    res.status(404)
    throw new Error('Testimonial not found')
  }
  await testimonial.deleteOne()
  res.json({ message: 'Testimonial removed' })
})
