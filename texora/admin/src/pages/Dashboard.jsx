import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineCube, HiOutlineMail, HiOutlineUsers, HiOutlineNewspaper } from 'react-icons/hi'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import api from '../utils/api'

const chartData = [
  { name: 'Mon', orders: 12 }, { name: 'Tue', orders: 19 }, { name: 'Wed', orders: 14 },
  { name: 'Thu', orders: 25 }, { name: 'Fri', orders: 22 }, { name: 'Sat', orders: 30 }, { name: 'Sun', orders: 18 },
]

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, messages: 0, users: 0, blogs: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, messages, users, blogs] = await Promise.allSettled([
          api.get('/products'), api.get('/contact'), api.get('/users'), api.get('/blogs'),
        ])
        setStats({
          products: products.value?.data?.length || 0,
          messages: messages.value?.data?.length || 0,
          users: users.value?.data?.length || 0,
          blogs: blogs.value?.data?.length || 0,
        })
      } catch (e) { /* ignore */ }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Welcome back! Here's what's happening at Texora." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={HiOutlineCube} label="Total Products" value={stats.products} color="gold" />
        <StatCard icon={HiOutlineMail} label="New Messages" value={stats.messages} color="blue" />
        <StatCard icon={HiOutlineUsers} label="Registered Users" value={stats.users} color="green" />
        <StatCard icon={HiOutlineNewspaper} label="Blog Posts" value={stats.blogs} color="navy" />
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h3 className="font-heading font-semibold text-navy mb-6">Weekly Orders Overview</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F2C230" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#F2C230" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="name" stroke="#0D1B2A" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#0D1B2A" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="orders" stroke="#D9A61E" strokeWidth={2} fill="url(#goldGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
