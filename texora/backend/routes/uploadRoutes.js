import express from 'express'
import upload from '../middleware/uploadMiddleware.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400)
    throw new Error('No file uploaded')
  }
  res.json({ imagePath: `/${req.file.path.replace(/\\\\/g, '/')}` })
})

export default router
