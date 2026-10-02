import express from 'express'
import {
  getUsers, deleteUser, updateUserRole, getDashboardStats,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, admin, getUsers)
router.get('/stats', protect, admin, getDashboardStats)
router.put('/:id/role', protect, admin, updateUserRole)
router.delete('/:id', protect, admin, deleteUser)

export default router
