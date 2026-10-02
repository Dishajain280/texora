import { motion } from 'framer-motion'
import { HiArrowUpRight } from 'react-icons/hi2'
import { fadeUp, viewportOnce } from '../utils/animations'

export default function ServiceCard({ icon: Icon, title, desc, index = 0 }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      whileHover={{ y: -8 }}
      className="group bg-soft hover:bg-navy rounded-2xl p-7 transition-colors duration-500 cursor-pointer"
    >
      <div className="w-14 h-14 rounded-xl bg-gold/15 group-hover:bg-gold text-gold-dark group-hover:text-navy grid place-items-center text-2xl mb-6 transition-colors duration-500">
        <Icon />
      </div>
      <h3 className="text-lg font-heading font-semibold text-navy group-hover:text-white mb-3 transition-colors duration-500">
        {title}
      </h3>
      <p className="text-sm text-navy/60 group-hover:text-white/60 leading-relaxed mb-5 transition-colors duration-500">
        {desc}
      </p>
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold-dark group-hover:text-gold transition-colors duration-500">
        Learn more <HiArrowUpRight />
      </span>
    </motion.div>
  )
}
