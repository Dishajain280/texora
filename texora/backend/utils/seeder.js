import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import Service from '../models/Service.js'
import Blog from '../models/Blog.js'
import Testimonial from '../models/Testimonial.js'
import Project from '../models/Project.js'

dotenv.config()
connectDB()

const services = [
  { title: 'Woven Texoras', description: 'High-quality woven fabrics produced with precision looms and premium raw materials.', icon: 'GiWeight', order: 1 },
  { title: 'Knit Warp & Circular', description: 'Advanced knitting technology delivering stretch, comfort and durability.', icon: 'GiSewingMachine', order: 2 },
  { title: 'Garment Manufacturing', description: 'End-to-end apparel manufacturing from pattern design to finished product.', icon: 'GiClothes', order: 3 },
  { title: 'Natural Fiber Texoras', description: 'Sustainably sourced natural fiber fabrics for eco-conscious brands.', icon: 'GiCottonFlower', order: 4 },
]

const projects = [
  { title: 'Luxury Fabric Collection', tag: 'Fashion' },
  { title: 'Denim Manufacturing Line', tag: 'Denim' },
  { title: 'Bridal Couture Textile', tag: 'Couture' },
  { title: 'Sustainable Cotton Yarn', tag: 'Eco' },
]

const blogs = [
  { title: 'Smart Texoras: How Technology is Transforming Fabrics', excerpt: 'Our mission is to empower businesses of all sizes to thrive.', content: 'Full article content here...', day: '21', month: 'July', comments: 3 },
  { title: 'The Future of Sustainable Fabrics in Global Fashion', excerpt: 'Our mission is to empower businesses of all sizes to thrive.', content: 'Full article content here...', day: '21', month: 'July', comments: 3 },
]

const testimonials = [
  { name: 'Savannah Nguyen', role: 'CEO, AB Tech', text: 'An industrial manufacturing company is a business entity that specializes in producing a wide range of products used across industries.' },
]

const importData = async () => {
  try {
    await User.deleteMany()
    await Service.deleteMany()
    await Project.deleteMany()
    await Blog.deleteMany()
    await Testimonial.deleteMany()

    await User.create({ name: 'Admin', email: 'admin@texora.com', password: 'admin123', role: 'admin' })
    await Service.insertMany(services)
    await Project.insertMany(projects)
    await Blog.insertMany(blogs)
    await Testimonial.insertMany(testimonials)

    console.log('Data Imported! Admin login -> admin@texora.com / admin123')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany()
    await Service.deleteMany()
    await Project.deleteMany()
    await Blog.deleteMany()
    await Testimonial.deleteMany()
    console.log('Data Destroyed!')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') destroyData()
else importData()
