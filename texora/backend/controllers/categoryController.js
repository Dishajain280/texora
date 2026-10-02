import asyncHandler from 'express-async-handler'
import Category from '../models/Category.js'
import { cloudinary, configureCloudinary } from '../config/cloudinary.js'

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'texora/catagory',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

// GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 })

  res.json(categories)
})

// GET /api/categories/:id
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  res.json(category)
})

// POST /api/categories
export const createCategory = asyncHandler(async (req, res) => {
  configureCloudinary()

  const { name } = req.body

  if (!name || !name.trim()) {
    res.status(400)
    throw new Error('Category name is required')
  }

  if (!req.file) {
    res.status(400)
    throw new Error('Category thumbnail image is required')
  }

  const existingCategory = await Category.findOne({
    name: name.trim(),
  })

  if (existingCategory) {
    res.status(400)
    throw new Error('Category already exists')
  }

  const uploadResult = await uploadToCloudinary(req.file.buffer)

  const category = await Category.create({
    name: name.trim(),
    image: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
  })

  res.status(201).json(category)
})

// PUT /api/categories/:id
export const updateCategory = asyncHandler(async (req, res) => {
  configureCloudinary()

  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  const { name } = req.body

  // Update name
  if (name && name.trim()) {
    const duplicateCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: category._id },
    })

    if (duplicateCategory) {
      res.status(400)
      throw new Error('Category already exists')
    }

    category.name = name.trim()
  }

  // Update image
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer)

    // Delete old Cloudinary image
    if (category.imagePublicId) {
      try {
        const result = await cloudinary.uploader.destroy(
          category.imagePublicId,
          {
            resource_type: 'image',
            invalidate: true,
          }
        )

        console.log(
          'Old category image delete result:',
          result
        )
      } catch (error) {
        console.error(
          'Old category image delete failed:',
          error.message
        )
      }
    }

    // Save new image
    category.image = uploadResult.secure_url
    category.imagePublicId = uploadResult.public_id
  }

  const updatedCategory = await category.save()

  res.json(updatedCategory)
})

// DELETE /api/categories/:id
export const deleteCategory = asyncHandler(async (req, res) => {
  configureCloudinary()

  const category = await Category.findById(req.params.id)

  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  console.log('Deleting category:', category._id)
  console.log(
    'Cloudinary Public ID:',
    category.imagePublicId
  )

  // Delete category image from Cloudinary
  if (category.imagePublicId) {
    try {
      const result = await cloudinary.uploader.destroy(
        category.imagePublicId,
        {
          resource_type: 'image',
          invalidate: true,
        }
      )

      console.log(
        'Cloudinary delete result:',
        result
      )

      if (
        result.result !== 'ok' &&
        result.result !== 'not found'
      ) {
        console.error(
          'Category image was not deleted:',
          result
        )
      }
    } catch (error) {
      console.error(
        'Category image delete failed:',
        error.message
      )
    }
  } else {
    console.warn(
      'No imagePublicId found for category:',
      category._id
    )
  }

  // Delete category from MongoDB
  await category.deleteOne()

  res.json({
    message:
      'Category and Cloudinary image deleted successfully',
  })
})