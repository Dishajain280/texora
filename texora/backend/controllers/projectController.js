import asyncHandler from 'express-async-handler'
import Project from '../models/Project.js'

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 })
  res.json(projects)
})

export const createProject = asyncHandler(async (req, res) => {
  const project = new Project(req.body)
  const created = await project.save()
  res.status(201).json(created)
})

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    res.status(404)
    throw new Error('Project not found')
  }
  Object.assign(project, req.body)
  const updated = await project.save()
  res.json(updated)
})

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) {
    res.status(404)
    throw new Error('Project not found')
  }
  await project.deleteOne()
  res.json({ message: 'Project removed' })
})
