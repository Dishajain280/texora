import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true },
    image: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
  },
  { timestamps: true }
)

export default mongoose.model('Testimonial', testimonialSchema)
