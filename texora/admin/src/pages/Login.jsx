import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back, Admin!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy grid place-items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-dark grid place-items-center text-navy font-heading font-bold">T</span>
          <span className="font-heading font-bold text-xl text-navy">Texora Admin</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="email" placeholder="Admin Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          <input required type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          <button disabled={loading} className="btn-gold w-full justify-center">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-xs text-navy/40 text-center mt-6">Seed default: admin@texora.com / admin123</p>
      </motion.div>
    </div>
  )
}
