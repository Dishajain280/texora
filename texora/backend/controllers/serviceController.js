import asyncHandler from 'express-async-handler'
import Service from '../models/Service.js'

export const getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({}).sort({ order: 1 })
  res.json(services)
})

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (service) res.json(service)
  else {
    res.status(404)
    throw new Error('Service not found')
  }
})

export const createService = asyncHandler(async (req, res) => {
  const service = new Service(req.body)
  const created = await service.save()
  res.status(201).json(created)
})

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) {
    res.status(404)
    throw new Error('Service not found')
  }
  Object.assign(service, req.body)
  const updated = await service.save()
  res.json(updated)
})

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
  if (!service) {
    res.status(404)
    throw new Error('Service not found')
  }
  await service.deleteOne()
  res.json({ message: 'Service removed' })
})
