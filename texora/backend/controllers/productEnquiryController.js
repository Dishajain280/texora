import asyncHandler from 'express-async-handler'
import ProductEnquiry from '../models/ProductEnquiry.js'
import Product from '../models/Product.js'

// =====================================================
// CREATE PRODUCT ENQUIRY
// POST /api/product-enquiries
// Public
// =====================================================
export const createProductEnquiry = asyncHandler(async (req, res) => {
  const {
    product,
    name,
    email,
    phone,
    address,
    description,
  } = req.body

  // Required fields validation
  if (
    !product ||
    !name ||
    !email ||
    !phone ||
    !address ||
    !description
  ) {
    res.status(400)
    throw new Error('All required fields must be filled')
  }

  // Find product and its category
  const existingProduct = await Product.findById(product).populate(
    'category',
    'name'
  )

  if (!existingProduct) {
    res.status(404)
    throw new Error('Product not found')
  }

  if (!existingProduct.category) {
    res.status(400)
    throw new Error('Product category not found')
  }

  // Save enquiry
  const enquiry = await ProductEnquiry.create({
    product: existingProduct._id,
    productName: existingProduct.name,

    category: existingProduct.category._id,
    categoryName: existingProduct.category.name,

    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    address: address.trim(),
    description: description.trim(),

    status: 'new',
  })

  res.status(201).json({
    success: true,
    message: 'Product enquiry submitted successfully',
    enquiry: {
      id: enquiry._id,
      productName: enquiry.productName,
      categoryName: enquiry.categoryName,
      status: enquiry.status,
    },
  })
})

// =====================================================
// GET ALL PRODUCT ENQUIRIES
// GET /api/product-enquiries
// Admin
// =====================================================
export const getProductEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await ProductEnquiry.find()
    .populate('product', 'name image')
    .populate('category', 'name')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: enquiries.length,
    enquiries,
  })
})

// =====================================================
// GET SINGLE PRODUCT ENQUIRY
// GET /api/product-enquiries/:id
// Admin
// =====================================================
export const getProductEnquiryById = asyncHandler(async (req, res) => {
  const enquiry = await ProductEnquiry.findById(req.params.id)
    .populate('product', 'name image')
    .populate('category', 'name')

  if (!enquiry) {
    res.status(404)
    throw new Error('Product enquiry not found')
  }

  res.status(200).json({
    success: true,
    enquiry,
  })
})

// =====================================================
// UPDATE PRODUCT ENQUIRY
// PUT /api/product-enquiries/:id
// Admin
// =====================================================
export const updateProductEnquiry = asyncHandler(async (req, res) => {
  const { status, remark } = req.body

  const enquiry = await ProductEnquiry.findById(req.params.id)

  if (!enquiry) {
    res.status(404)
    throw new Error('Product enquiry not found')
  }

  // Update status only if provided
  if (status !== undefined) {
    const allowedStatuses = ['new', 'contacted', 'closed']

    if (!allowedStatuses.includes(status)) {
      res.status(400)
      throw new Error('Invalid enquiry status')
    }

    enquiry.status = status
  }

  // Update remark
  if (remark !== undefined) {
    enquiry.remark = remark.trim()
  }

  const updatedEnquiry = await enquiry.save()

  res.status(200).json({
    success: true,
    message: 'Product enquiry updated successfully',
    enquiry: updatedEnquiry,
  })
})

// =====================================================
// DELETE PRODUCT ENQUIRY
// DELETE /api/product-enquiries/:id
// Admin
// =====================================================
export const deleteProductEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await ProductEnquiry.findById(req.params.id)

  if (!enquiry) {
    res.status(404)
    throw new Error('Product enquiry not found')
  }

  await enquiry.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Product enquiry deleted successfully',
  })
})