import { motion } from 'framer-motion'
import { HiArrowUpRight } from 'react-icons/hi2'
import { scaleIn, viewportOnce } from '../utils/animations'

export default function ProjectCard({ title, tag, index = 0 }) {
  return (
    <motion.div
      custom={index}
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      whileHover={{ scale: 1.03 }}
      className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer bg-gradient-to-br from-navy-light to-navy"
    >
      <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-500 bg-[radial-gradient(circle_at_70%_30%,rgba(242,194,48,0.4),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
      <div className="absolute bottom-0 p-6 w-full flex items-end justify-between">
        <div>
          <span className="text-gold text-xs font-semibold uppercase tracking-wider">{tag}</span>
          <h3 className="text-white font-heading font-semibold text-lg mt-1">{title}</h3>
        </div>
        <motion.span
          whileHover={{ rotate: 45 }}
          className="w-10 h-10 rounded-full bg-gold text-navy grid place-items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <HiArrowUpRight />
        </motion.span>
      </div>
    </motion.div>
  )
}
