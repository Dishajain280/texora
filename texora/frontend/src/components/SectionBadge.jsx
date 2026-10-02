import { motion } from 'framer-motion'

export default function SectionBadge({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="section-badge"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" /> {children}
    </motion.span>
  )
}
