import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <section className="min-h-screen grid place-items-center bg-navy pt-20">
      <div className="text-center">
        <motion.h1
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="text-8xl font-heading font-bold text-gold mb-4"
        >
          404
        </motion.h1>
        <p className="text-white/60 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Back To Home</Link>
      </div>
    </section>
  )
}
