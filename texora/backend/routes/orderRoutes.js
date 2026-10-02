import express from 'express'
import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { protect, optionalAuth, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .post(optionalAuth, createOrder)
  .get(protect, admin, getOrders)

router.post('/razorpay/create', createRazorpayOrder)
router.post('/razorpay/verify', verifyRazorpayPayment)

router.get('/my-orders', protect, getMyOrders)
router.get('/:id', optionalAuth, getOrderById)
router.put('/:id/status', protect, admin, updateOrderStatus)

export default router
