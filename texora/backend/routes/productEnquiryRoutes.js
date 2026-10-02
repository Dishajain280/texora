import express from 'express'

import {
  createProductEnquiry,
  getProductEnquiries,
  getProductEnquiryById,
  updateProductEnquiry,
  deleteProductEnquiry,
} from '../controllers/productEnquiryController.js'

import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// =====================================================
// CUSTOMER
// =====================================================

// Submit product enquiry
// Public route
router.post('/', createProductEnquiry)


// =====================================================
// ADMIN
// =====================================================

// Get all enquiries
router.get('/', protect, admin, getProductEnquiries)

// Get single enquiry
router.get('/:id', protect, admin, getProductEnquiryById)

// Update enquiry status / remark
router.put('/:id', protect, admin, updateProductEnquiry)

// Delete enquiry
router.delete('/:id', protect, admin, deleteProductEnquiry)

export default router