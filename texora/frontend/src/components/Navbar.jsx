import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX, HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi'
import { NAV_LINKS } from '../utils/constants'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { getCartCount } = useCart()
  const { user, logout } = useAuth()
  const cartCount = getCartCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container-x">
        <div
          className={`flex items-center justify-between rounded-full px-5 md:px-6 transition-all duration-500 ${
            scrolled ? 'bg-white/95 shadow-lg shadow-navy/10 py-2' : 'bg-white/90 backdrop-blur py-3'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <motion.span
              whileHover={{ rotate: 15 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dark grid place-items-center text-navy font-heading font-bold"
            >
              T
            </motion.span>
            <span className="font-heading font-bold text-xl text-navy">Texora</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-sm font-semibold uppercase tracking-wide transition-colors ${
                    isActive ? 'text-gold-dark' : 'text-navy hover:text-gold-dark'
                  } group`
                }
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative w-10 h-10 rounded-full border border-navy/15 grid place-items-center text-navy hover:bg-navy hover:text-white transition-colors"
              aria-label="Shopping Cart"
            >
              <HiOutlineShoppingBag className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-navy text-xs font-bold w-5 h-5 rounded-full grid place-items-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth / Account Link */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/my-orders"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-soft text-navy hover:bg-navy hover:text-white transition-colors"
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-navy/60 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex w-10 h-10 rounded-full border border-navy/15 grid place-items-center text-navy hover:bg-navy hover:text-white transition-colors"
                title="Login"
              >
                <HiOutlineUser className="text-xl" />
              </Link>
            )}

            <Link to="/contact" className="hidden lg:inline-flex btn-primary !py-2.5 !px-5 text-sm">
              Contact Us <span aria-hidden>→</span>
            </Link>

            <button
              className="lg:hidden w-10 h-10 grid place-items-center text-navy text-2xl"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden mt-2 mx-4"
          >
            <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2 px-3 rounded-lg font-semibold ${
                      isActive ? 'bg-gold/15 text-gold-dark' : 'text-navy hover:bg-soft'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-soft font-semibold text-navy"
              >
                <span className="flex items-center gap-2">
                  <HiOutlineShoppingBag className="text-lg" /> My Cart
                </span>
                <span className="bg-gold text-navy px-2 py-0.5 rounded-full text-xs font-bold">
                  {cartCount}
                </span>
              </Link>

              {user ? (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setOpen(false)}
                    className="py-2 px-3 rounded-lg font-semibold text-navy hover:bg-soft"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="text-left py-2 px-3 rounded-lg font-semibold text-red-600 hover:bg-red-50"
                  >
                    Logout ({user.name})
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="py-2 px-3 rounded-lg font-semibold text-navy hover:bg-soft"
                >
                  Login / Register
                </Link>
              )}

              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary justify-center mt-2">
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
