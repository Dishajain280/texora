import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Send,
  Tag,
  User,
  ShoppingBag,
  Plus,
  Minus,
  CreditCard,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [qty, setQty] = useState(1)

  const [form, setForm] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    address: '',
    description: '',
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        const { data } = await api.get(`/products/${id}`)

        setProduct(data)
      } catch (error) {
        console.error(error)

        toast.error(
          error.response?.data?.message || 'Failed to load product'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!product) return

    try {
      setSubmitting(true)

      await api.post('/product-enquiries', {
        product: product._id,
        name: form.name,
        email: form.email,
        phone: `${form.countryCode} ${form.phone}`,
        address: form.address,
        description: form.description,
      })

      toast.success('Your enquiry has been sent successfully!')

      setForm({
        name: '',
        email: '',
        countryCode: '+91',
        phone: '',
        address: '',
        description: '',
      })
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message ||
          'Failed to send enquiry. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-soft px-4 pb-16 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-32 rounded bg-navy/10" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="aspect-[4/3] rounded-2xl bg-navy/10" />

            <div className="space-y-5">
              <div className="h-7 w-32 rounded bg-navy/10" />
              <div className="h-10 w-2/3 rounded bg-navy/10" />
              <div className="h-24 rounded bg-navy/10" />
              <div className="h-12 rounded bg-navy/10" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-soft px-4 pt-28">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">
            Product not found
          </h1>

          <Link
            to="/products"
            className="mt-5 inline-flex items-center gap-2 font-semibold text-navy transition hover:text-gold"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </section>
    )
  }

  const categoryName = product.category?.name || 'Uncategorized'

  return (
    <main className="bg-soft">

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}
      <section className="px-4 pb-16 pt-32 sm:px-6 sm:pt-36 lg:pb-20">
        <div className="mx-auto max-w-7xl">

          {/* Back */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-gold"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

          {/* Main Product Layout */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">

            {/* Product Image */}
            <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm">
            <div className="group flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">
                {product.image ? (
                    <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition duration-500 ease-out group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="text-sm text-navy/40">
                    No Image
                    </div>
                )}
                </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center">

              {/* Category */}
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-navy/10 bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy">
                <Tag size={13} />
                {categoryName}
              </span>

              {/* Product Name */}
              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-navy">
                  ₹{(product.price || 499).toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-medium text-navy/50">
                  (Inclusive of all taxes)
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-navy/65 sm:text-base">
                  {product.description}
                </p>
              )}

              {/* Quantity Selector & Purchase Actions */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center rounded-xl border border-navy/15 bg-white p-1.5 w-fit">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-lg bg-soft grid place-items-center text-navy hover:bg-navy hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-navy">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 rounded-lg bg-soft grid place-items-center text-navy hover:bg-navy hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => addToCart(product, qty)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-sm font-bold text-white transition hover:bg-navy/90 shadow-md"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => {
                      addToCart(product, qty)
                      navigate('/checkout')
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-6 py-3.5 text-sm font-bold text-navy transition hover:shadow-lg"
                  >
                    <CreditCard size={18} />
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications?.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-navy">
                    Specifications
                  </h2>

                  <div className="mt-4 overflow-hidden rounded-xl border border-navy/10 bg-white">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[42%_58%] border-b border-navy/10 last:border-b-0"
                      >
                        <div className="bg-soft px-4 py-3 text-sm font-semibold text-navy">
                          {spec.name}
                        </div>

                        <div className="px-4 py-3 text-sm text-navy/65">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enquiry Button */}
              <a
                href="#product-enquiry"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl border border-navy/20 bg-white px-5 py-2.5 text-xs font-semibold text-navy transition hover:bg-soft"
              >
                Send Bulk Product Enquiry
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ENQUIRY SECTION
      ===================================================== */}
      <section
        id="product-enquiry"
        className="border-t border-navy/10 bg-navy/[0.04] px-4 py-12 sm:px-6 sm:py-16"
        >
        <div className="mx-auto max-w-6xl">

          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1.5 text-xs font-semibold text-navy">
              <Send size={13} />
              Product Enquiry
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Interested in this product?
            </h2>

            <p className="mt-3 text-sm leading-6 text-navy/60 sm:text-base">
              Send us your enquiry and our team will get back to you with
              the required information.
            </p>
          </div>

          {/* Enquiry Card */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-navy/15 bg-white shadow-lg">

            {/* Product Identification */}
            <div className="border-b border-navy/10 bg-white px-5 py-5 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy/45">
                Enquiring About
              </p>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-navy">
                    {product.name}
                  </h3>

                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 text-xs font-semibold text-navy">
                    <Tag size={12} />
                    {categoryName}
                  </span>
                </div>

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-20 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="px-5 py-5 sm:px-7 sm:py-7"
            >
              <div className="grid gap-5 md:grid-cols-2">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-navy/10 bg-white py-3 pl-10 pr-4 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-navy/10 bg-white py-3 pl-10 pr-4 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Phone Number
                  </label>

                  <div className="flex overflow-hidden rounded-xl border border-navy/10 bg-white focus-within:border-navy/30 focus-within:ring-2 focus-within:ring-navy/10">

                    <select
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleChange}
                      className="border-r border-navy/10 bg-soft px-3 text-sm font-medium text-navy outline-none"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+974">🇶🇦 +974</option>
                    </select>

                    <div className="relative flex-1">
                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="Enter your phone number"
                        className="w-full bg-transparent py-3 pl-10 pr-4 text-sm text-navy outline-none placeholder:text-navy/35"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-3 text-navy/40"
                    />

                    <textarea
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      placeholder="Enter your complete address"
                      className="w-full resize-none rounded-xl border border-navy/10 bg-white py-3 pl-10 pr-4 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-navy"
                  >
                    Enquiry / Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Tell us what you are looking for..."
                    className="w-full resize-none rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy outline-none transition placeholder:text-navy/35 focus:border-navy/30 focus:ring-2 focus:ring-navy/10"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy px-7 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Send size={17} />

                  {submitting
                    ? 'Sending Enquiry...'
                    : 'Send Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}