import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../utils/animations'

export default function AnimatedSection({ children, className = '', custom = 0 }) {
  return (
    <motion.div
      custom={custom}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.div>
  )
}
