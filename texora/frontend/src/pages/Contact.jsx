import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { toast } from 'react-toastify'
import PageHero from '../components/PageHero'
import SectionBadge from '../components/SectionBadge'
import { slideInLeft, slideInRight, viewportOnce } from '../utils/animations'
import { COMPANY } from '../utils/constants'
import api from '../utils/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent successfully! We will get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const info = [
    { icon: HiOutlineLocationMarker, label: 'Address', value: COMPANY.address },
    { icon: HiOutlinePhone, label: 'Phone', value: COMPANY.phone },
    { icon: HiOutlineMail, label: 'Email', value: COMPANY.email },
  ]

  return (
    <>
      <PageHero subtitle="Get In Touch" title="Contact Us" crumb="Contact" />

      <section className="py-24 bg-white">
        <div className="container-x grid lg:grid-cols-3 gap-6 mb-16">
          {info.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.1 }}
              className="bg-soft rounded-2xl p-7 flex items-start gap-4"
            >
              <span className="w-12 h-12 rounded-xl bg-gold/15 text-gold-dark grid place-items-center text-xl shrink-0">
                <item.icon />
              </span>
              <div>
                <p className="text-sm text-navy/50">{item.label}</p>
                <p className="font-semibold text-navy">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <SectionBadge>Get In Touch</SectionBadge>
            <h2 className="section-title mt-5 mb-5">Let's Discuss Your Next Texora Project</h2>
            <p className="text-navy/60 leading-relaxed mb-6">
              Texora & Garments Design Studio combines modernity with rich heritage. We are a complete manufacturing partner from concept to delivery.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input required name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none transition-colors" />
                <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none transition-colors" />
              </div>
              <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none transition-colors" />
              <textarea required name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Your Message" className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none transition-colors resize-none" />
              <button disabled={loading} type="submit" className="btn-primary">
                {loading ? 'Sending...' : 'Submit A Message'} <span aria-hidden>→</span>
              </button>
            </form>
          </motion.div>

          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={viewportOnce} className="rounded-3xl h-[480px] bg-gradient-to-br from-navy via-navy-light to-gold/20" />
        </div>
      </section>
    </>
  )
}
