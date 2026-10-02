import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  if (loading) return <Loader />

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
          <Route path="/products/:id" element={<PageWrapper><ProductDetails /></PageWrapper>} />
          <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
          <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="/order-success/:id" element={<PageWrapper><OrderSuccess /></PageWrapper>} />
          <Route path="/my-orders" element={<PageWrapper><MyOrders /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  )
}
