import asyncHandler from 'express-async-handler'
import Blog from '../models/Blog.js'

export const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 })
  res.json(blogs)
})

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) res.json(blog)
  else {
    res.status(404)
    throw new Error('Blog not found')
  }
})

export const createBlog = asyncHandler(async (req, res) => {
  const blog = new Blog(req.body)
  const created = await blog.save()
  res.status(201).json(created)
})

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    res.status(404)
    throw new Error('Blog not found')
  }
  Object.assign(blog, req.body)
  const updated = await blog.save()
  res.json(updated)
})

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    res.status(404)
    throw new Error('Blog not found')
  }
  await blog.deleteOne()
  res.json({ message: 'Blog removed' })
})
