import asyncHandler from 'express-async-handler'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import { cloudinary, configureCloudinary } from '../config/cloudinary.js'

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'texora/products',
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

// GET /api/products
// Optional: /api/products?category=CATEGORY_ID
export const getProducts = asyncHandler(async (req, res) => {
  const filter = {}

  if (req.query.keyword) {
    filter.name = {
      $regex: req.query.keyword,
      $options: 'i',
    }
  }

  if (req.query.category) {
    filter.category = req.query.category
  }

  const products = await Product.find(filter)
    .populate('category', 'name image')
    .sort({ createdAt: -1 })

  res.json(products)
})

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'category',
    'name image'
  )

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  res.json(product)
})

// POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  configureCloudinary()

  const {
    name,
    category,
    description,
    specifications,
    featured,
  } = req.body

  // Product name validation
  if (!name?.trim()) {
    res.status(400)
    throw new Error('Product name is required')
  }

  // Category validation
  if (!category) {
    res.status(400)
    throw new Error('Category is required')
  }

  // Description validation
  if (!description?.trim()) {
    res.status(400)
    throw new Error('Product description is required')
  }

  // Image validation
  if (!req.file) {
    res.status(400)
    throw new Error('Product image is required')
  }

  // Category exists check
  const categoryExists = await Category.findById(category)

  if (!categoryExists) {
    res.status(400)
    throw new Error('Selected category not found')
  }

  // Specifications parse
  let parsedSpecifications = []

  if (specifications) {
    try {
      parsedSpecifications =
        typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications
    } catch (error) {
      res.status(400)
      throw new Error('Invalid specifications format')
    }
  }

  // Exactly 3 specifications
  if (parsedSpecifications.length !== 3) {
    res.status(400)
    throw new Error('Exactly 3 specifications are required')
  }

  // Validate specification fields
  for (const specification of parsedSpecifications) {
    if (
      !specification.name?.trim() ||
      !specification.value?.trim()
    ) {
      res.status(400)
      throw new Error(
        'Each specification must have a name and value'
      )
    }
  }

  // Upload image to Cloudinary
  const uploadResult = await uploadToCloudinary(req.file.buffer)

  // Create product
  const product = await Product.create({
    name: name.trim(),
    category,
    description: description.trim(),

    image: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,

    specifications: parsedSpecifications.map((item) => ({
      name: item.name.trim(),
      value: item.value.trim(),
    })),

    featured:
      featured === 'true' || featured === true,
  })

  const createdProduct = await Product.findById(
    product._id
  ).populate('category', 'name image')

  res.status(201).json(createdProduct)
})

// PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  configureCloudinary()

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const {
    name,
    category,
    description,
    specifications,
    featured,
  } = req.body

  // Update name
  if (name !== undefined) {
    if (!name.trim()) {
      res.status(400)
      throw new Error('Product name is required')
    }

    product.name = name.trim()
  }

  // Update category
  if (category !== undefined) {
    const categoryExists = await Category.findById(category)

    if (!categoryExists) {
      res.status(400)
      throw new Error('Selected category not found')
    }

    product.category = category
  }

  // Update description
  if (description !== undefined) {
    if (!description.trim()) {
      res.status(400)
      throw new Error('Product description is required')
    }

    product.description = description.trim()
  }

  // Update specifications
  if (specifications !== undefined) {
    let parsedSpecifications = []

    try {
      parsedSpecifications =
        typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications
    } catch (error) {
      res.status(400)
      throw new Error('Invalid specifications format')
    }

    // Exactly 3 specifications
    if (parsedSpecifications.length !== 3) {
      res.status(400)
      throw new Error('Exactly 3 specifications are required')
    }

    // Validate specification fields
    for (const specification of parsedSpecifications) {
      if (
        !specification.name?.trim() ||
        !specification.value?.trim()
      ) {
        res.status(400)
        throw new Error(
          'Each specification must have a name and value'
        )
      }
    }

    product.specifications = parsedSpecifications.map(
      (item) => ({
        name: item.name.trim(),
        value: item.value.trim(),
      })
    )
  }

  // Update featured
  if (featured !== undefined) {
    product.featured =
      featured === 'true' || featured === true
  }

  // New image uploaded
  if (req.file) {
    const uploadResult = await uploadToCloudinary(
      req.file.buffer
    )

    // Delete old Cloudinary image
    if (product.imagePublicId) {
      try {
        const result =
          await cloudinary.uploader.destroy(
            product.imagePublicId,
            {
              resource_type: 'image',
              invalidate: true,
            }
          )

        console.log(
          'Old product image delete result:',
          result
        )
      } catch (error) {
        console.error(
          'Old product image delete failed:',
          error.message
        )
      }
    }

    product.image = uploadResult.secure_url
    product.imagePublicId = uploadResult.public_id
  }

  const updatedProduct = await product.save()

  const populatedProduct = await Product.findById(
    updatedProduct._id
  ).populate('category', 'name image')

  res.json(populatedProduct)
})

// DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  configureCloudinary()

  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  console.log('Deleting product:', product._id)
  console.log(
    'Cloudinary Public ID:',
    product.imagePublicId
  )

  // Delete image from Cloudinary
  if (product.imagePublicId) {
    try {
      const result = await cloudinary.uploader.destroy(
        product.imagePublicId,
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
          'Cloudinary image was not deleted:',
          result
        )
      }
    } catch (error) {
      console.error(
        'Cloudinary image delete failed:',
        error
      )
    }
  } else {
    console.warn(
      'No imagePublicId found for product:',
      product._id
    )
  }

  // Delete product from MongoDB
  await product.deleteOne()

  res.json({
    message:
      'Product and Cloudinary image deleted successfully',
  })
})