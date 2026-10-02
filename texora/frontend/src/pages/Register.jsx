import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen grid lg:grid-cols-2 pt-20">
      <div className="flex items-center justify-center p-8 order-2 lg:order-1">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-navy mb-2">Create Account</h2>
          <p className="text-navy/50 mb-8">Join Texora and start your journey with us.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Full Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none" />
            <input required type="email" placeholder="Email address" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none" />
            <input required type="password" placeholder="Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-navy/10 focus:border-gold focus:outline-none" />
            <button disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="text-sm text-navy/50 mt-6 text-center">
            Already have an account? <Link to="/login" className="text-gold-dark font-semibold">Sign In</Link>
          </p>
        </motion.div>
      </div>
      <div className="hidden lg:block bg-navy relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(242,194,48,0.2),transparent_50%)]" />
        <div className="h-full grid place-items-center relative z-10 p-16 text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Join The Texora Family</h2>
            <p className="text-white/60">Create an account to place orders and track your manufacturing projects.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
