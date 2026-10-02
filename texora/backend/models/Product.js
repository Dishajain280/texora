import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 499,
    },

    stock: {
      type: Number,
      default: 100,
    },

    image: {
      type: String,
      default: '',
    },

    imagePublicId: {
      type: String,
      default: '',
    },

    specifications: [
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
],

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Product', productSchema)