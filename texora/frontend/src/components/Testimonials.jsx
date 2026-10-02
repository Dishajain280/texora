import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import { FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Savannah Nguyen',
    role: 'CEO, AB Tech',
    text: 'An industrial manufacturing company is a business entity that specializes in producing and supplying a wide range of products and components used in various industries.',
  },
  {
    name: 'Marvin McKinney',
    role: 'Founder, Loom & Co',
    text: 'Texora delivered outstanding quality and consistency across every order. Their team communicated clearly and shipped right on schedule.',
  },
  {
    name: 'Courtney Henry',
    role: 'Director, Fabric House',
    text: 'The sustainable practices and quality inspection teams give us total confidence in every batch we receive from Texora.',
  },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const next = () => setIndex((p) => (p + 1) % testimonials.length)
  const prev = () => setIndex((p) => (p - 1 + testimonials.length) % testimonials.length)
  const t = testimonials[index]

  return (
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden h-80 bg-gradient-to-br from-gold/20 to-navy-light"
      >
        <div className="absolute inset-0 grid place-items-center text-white/20 text-8xl font-heading font-bold">
          {t.name.charAt(0)}
        </div>
      </motion.div>

      <div>
        <FaQuoteLeft className="text-gold text-3xl mb-5" />
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed mb-8"
          >
            "{t.text}"
          </motion.p>
        </AnimatePresence>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-heading font-semibold">{t.name}</h4>
            <p className="text-white/50 text-sm">{t.role}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={prev} className="w-11 h-11 rounded-full border border-white/20 text-white grid place-items-center hover:bg-gold hover:text-navy hover:border-gold transition-colors">
              <HiArrowLeft />
            </button>
            <button onClick={next} className="w-11 h-11 rounded-full border border-white/20 text-white grid place-items-center hover:bg-gold hover:text-navy hover:border-gold transition-colors">
              <HiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
