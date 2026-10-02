// admin/src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineViewGrid, HiOutlineCube, HiOutlineCollection, HiOutlineNewspaper,
  HiOutlineChatAlt2, HiOutlineMail, HiOutlineUsers, HiOutlineLogout, HiOutlineSparkles,HiOutlineChat,
  HiOutlineShoppingBag,
} from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: HiOutlineViewGrid, end: true },
  { to: '/orders', label: 'Orders', icon: HiOutlineShoppingBag },
  { to: '/categories', label: 'Categories', icon: HiOutlineCollection },
  { to: '/products', label: 'Products', icon: HiOutlineCube },
  { to: '/product-enquiries', label: 'Product Enquiries', icon: HiOutlineChat },
  
  { to: '/services', label: 'Services', icon: HiOutlineSparkles },
  { to: '/projects', label: 'Projects', icon: HiOutlineCollection },
  { to: '/blogs', label: 'Blog Posts', icon: HiOutlineNewspaper },
  { to: '/testimonials', label: 'Testimonials', icon: HiOutlineChatAlt2 },
  { to: '/messages', label: 'Messages', icon: HiOutlineMail },
  { to: '/users', label: 'Users', icon: HiOutlineUsers },

]

export default function Sidebar() {
  const { logout, admin } = useAuth()

  return (
    <aside className="w-64 shrink-0 bg-navy text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
        <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dark grid place-items-center text-navy font-heading font-bold">T</span>
        <div>
          <p className="font-heading font-bold leading-none">Texora</p>
          <p className="text-[11px] text-white/40">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
                isActive ? 'bg-gold text-navy' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon size={18} />
                {link.label}
                {isActive && (
                  <motion.span layoutId="active-pill" className="absolute inset-0 rounded-xl -z-10 bg-gold" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gold/20 text-gold grid place-items-center font-semibold text-sm">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{admin?.name}</p>
            <p className="text-xs text-white/40 truncate">{admin?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-white/60 hover:text-white text-sm w-full px-2 py-2">
          <HiOutlineLogout /> Logout
        </button>
      </div>
    </aside>
  )
}
