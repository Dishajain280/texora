import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PageHero({ title, subtitle, crumb }) {
  return (
    <section className="relative pt-40 pb-24 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(242,194,48,0.15),transparent_45%)]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute -right-16 -top-16 w-64 h-64 border border-white/10 rounded-full"
      />
      <div className="container-x relative text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold text-sm font-semibold uppercase tracking-widest mb-3"
        >
          {subtitle}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-2 text-white/60 text-sm"
        >
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">{crumb}</span>
        </motion.div>
      </div>
    </section>
  )
}
