// backend/routes/productRoutes.js
import express from 'express'

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'

import { protect, admin } from '../middleware/authMiddleware.js'
import uploadProductImage from '../middleware/productUploadMiddleware.js'

const router = express.Router()

// GET all products
// GET products by category:
// /api/products?category=CATEGORY_ID
router
  .route('/')
  .get(getProducts)
  .post(
    protect,
    admin,
    uploadProductImage.single('image'),
    createProduct
  )

// Single product
router
  .route('/:id')
  .get(getProductById)
  .put(
    protect,
    admin,
    uploadProductImage.single('image'),
    updateProduct
  )
  .delete(
    protect,
    admin,
    deleteProduct
  )

export default router