import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <div className="fixed inset-0 z-[100] bg-navy grid place-items-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 border-4 border-gold/20 border-t-gold rounded-full"
      />
    </div>
  )
}
