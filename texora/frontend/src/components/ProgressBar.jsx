import { motion } from 'framer-motion'

export default function ProgressBar({ label, percent }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold text-navy mb-2">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-1.5 bg-navy/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
        />
      </div>
    </div>
  )
}
