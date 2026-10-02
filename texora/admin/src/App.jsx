import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Services from './pages/Services'
import Projects from './pages/Projects'
import Blogs from './pages/Blogs'
import Testimonials from './pages/Testimonials'
import Messages from './pages/Messages'
import Users from './pages/Users'
import Categories from './pages/Categories'
import ProductEnquiries from './pages/ProductEnquiries'
import Orders from './pages/Orders'


function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8 min-h-screen">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Layout><Products /></Layout></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><Layout><Services /></Layout></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
        <Route path="/blogs" element={<ProtectedRoute><Layout><Blogs /></Layout></ProtectedRoute>} />
        <Route path="/testimonials" element={<ProtectedRoute><Layout><Testimonials /></Layout></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Layout><Messages /></Layout></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Layout><Categories /></Layout></ProtectedRoute>} />
        <Route path="/product-enquiries" element={<ProtectedRoute><Layout><ProductEnquiries /></Layout></ProtectedRoute>} />

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  )
}
