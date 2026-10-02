import mongoose from 'mongoose'

const productEnquirySchema = new mongoose.Schema(
  {
    // Product identification
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    // Customer details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Admin can update this later
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },

    remark: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('ProductEnquiry', productEnquirySchema)