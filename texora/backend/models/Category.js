import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    image: {
      type: String,
      required: true,
    },

    imagePublicId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Category', categorySchema)