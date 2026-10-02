import CountUp from 'react-countup'
import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../utils/animations'

export default function StatCounter({ end, suffix = '+', label, index = 0, dark = false }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="text-center"
    >
      <h3 className={`text-4xl md:text-5xl font-heading font-bold ${dark ? 'text-white' : 'text-navy'}`}>
        <CountUp end={end} duration={2.5} enableScrollSpy scrollSpyOnce />
        <span className="text-gold">{suffix}</span>
      </h3>
      <p className={`mt-2 text-sm font-medium ${dark ? 'text-white/60' : 'text-navy/60'}`}>{label}</p>
    </motion.div>
  )
}
