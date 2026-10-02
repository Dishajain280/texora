import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

// @desc    Get all users (admin)
// @route   GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
})

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  await user.deleteOne()
  res.json({ message: 'User removed' })
})

// @desc    Update user role (admin)
// @route   PUT /api/users/:id/role
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  user.role = req.body.role || user.role
  const updated = await user.save()
  res.json(updated)
})

// @desc    Dashboard stats (admin)
// @route   GET /api/users/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments()
  res.json({ userCount })
})
