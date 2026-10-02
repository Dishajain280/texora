import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    image: { type: String, default: '' },
    comments: { type: Number, default: 0 },
    day: { type: String },
    month: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('Blog', blogSchema)
