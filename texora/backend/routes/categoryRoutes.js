// backend/routes/categoryRoutes.js
import express from 'express'

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

import uploadCategoryImage from '../middleware/categoryUploadMiddleware.js'

const router = express.Router()

// Public
router.get('/', getCategories)
router.get('/:id', getCategoryById)

// Admin
router.post(
  '/',
  protect,
  admin,
  uploadCategoryImage.single('image'),
  createCategory
)

router.put(
  '/:id',
  protect,
  admin,
  uploadCategoryImage.single('image'),
  updateCategory
)

router.delete(
  '/:id',
  protect,
  admin,
  deleteCategory
)

export default router