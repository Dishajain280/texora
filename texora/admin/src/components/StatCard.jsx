import { motion } from 'framer-motion'

const colorMap = {
  gold: 'bg-gold/15 text-gold-dark',
  navy: 'bg-navy/10 text-navy',
  green: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
}

export default function StatCard({ icon: Icon, label, value, color = 'gold' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card flex items-center gap-4"
    >
      <div className={`w-14 h-14 rounded-xl grid place-items-center text-2xl ${colorMap[color] || colorMap.gold}`}>
        <Icon />
      </div>
      <div>
        <p className="text-2xl font-heading font-bold text-navy">{value}</p>
        <p className="text-sm text-navy/50">{label}</p>
      </div>
    </motion.div>
  )
}
