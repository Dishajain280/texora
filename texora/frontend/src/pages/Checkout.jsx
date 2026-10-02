import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

// Helper function to dynamically load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart, getCartSubtotal } = useCart()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  })

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
      }))
    }
  }, [user])

  const subtotal = getCartSubtotal()
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99
  const tax = Math.round(subtotal * 0.05)
  const grandTotal = Math.max(0, subtotal + shipping + tax)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error('Your cart is empty')
      navigate('/products')
      return
    }

    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.postalCode) {
      toast.error('Please fill in all required shipping fields')
      return
    }

    try {
      setLoading(true)

      // 1. Prepare Order Payload
      const orderProducts = cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image || '',
        quantity: item.quantity,
        price: item.price || 499,
      }))

      const orderPayload = {
        products: orderProducts,
        totalAmount: grandTotal,
        paymentMethod,
        shippingAddress: form,
      }

      // 2. Create Pending Order in database
      const { data: createdOrder } = await api.post('/orders', orderPayload)

      if (paymentMethod === 'cod') {
        clearCart()
        toast.success('Order placed successfully via Cash on Delivery!')
        navigate(`/order-success/${createdOrder._id}`)
        return
      }

      // 3. Handle Razorpay Online Payment Flow
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.')
        setLoading(false)
        return
      }

      // Call backend to generate Razorpay order ID
      const { data: razorpayData } = await api.post('/orders/razorpay/create', {
        amount: grandTotal,
        currency: 'INR',
      })

      if (!razorpayData?.id) {
        throw new Error('Failed to create Razorpay Order')
      }

      const razorpayKey = razorpayData.key || 'rzp_test_TexoraPay2026'

      const options = {
        key: razorpayKey,
        amount: razorpayData.amount,
        currency: razorpayData.currency || 'INR',
        name: 'Texora Textiles & Garments',
        description: `Order #${createdOrder._id.slice(-6).toUpperCase()}`,
        order_id: razorpayData.id.startsWith('order_test_') ? undefined : razorpayData.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          orderId: createdOrder._id,
        },
        theme: {
          color: '#0F2C59',
        },
        handler: async function (response) {
          try {
            toast.loading('Verifying Razorpay Payment...', { id: 'verify_toast' })

            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id || razorpayData.id,
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'mock_signature',
              orderId: createdOrder._id,
            }

            await api.post('/orders/razorpay/verify', verifyPayload)

            toast.dismiss('verify_toast')
            toast.success('Payment Successful!')
            clearCart()
            navigate(`/order-success/${createdOrder._id}`)
          } catch (err) {
            toast.dismiss('verify_toast')
            console.error('Razorpay verification error:', err)
            toast.error(err.response?.data?.message || 'Payment verification failed')
          }
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment window closed')
            setLoading(false)
          },
        },
      }

      // Fallback modal simulation if Razorpay dummy key is in test mode without live script window
      if (typeof window.Razorpay !== 'undefined') {
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (resp) {
          toast.error(resp.error?.description || 'Payment Failed')
          setLoading(false)
        })
        rzp.open()
      } else {
        // Fallback execution for test environment
        options.handler({
          razorpay_order_id: razorpayData.id,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'test_verified_sig',
        })
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-[75vh] bg-soft px-4 pt-32 grid place-items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Your cart is empty</h1>
          <Link to="/products" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark">
            <ArrowLeft size={16} /> Back to Products
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-soft min-h-screen px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-navy/10 pb-6 flex items-center justify-between">
          <div>
            <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy/60 hover:text-navy mb-2">
              <ArrowLeft size={14} /> Back to Cart
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Checkout & Payment
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-navy/60 bg-white border border-navy/10 px-3 py-1.5 rounded-full">
            <Lock size={14} className="text-green-600" /> 256-Bit SSL Encrypted
          </div>
        </div>

        <form onSubmit={handleCheckout} className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px] lg:gap-12">
          {/* Shipping & Payment Section */}
          <div className="space-y-8">
            {/* Step 1: Shipping Details */}
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-navy border-b border-navy/10 pb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs text-white">1</span>
                Shipping Address
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-navy mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="name@domain.com"
                    className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-navy mb-1">Street / House Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="House no., Building, Street name"
                    className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Mumbai"
                    className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">State / Region</label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g. Maharashtra"
                    className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Pincode / Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="400001"
                    className="w-full rounded-xl border border-navy/15 bg-white p-3 text-sm text-navy outline-none focus:border-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    readOnly
                    className="w-full rounded-xl border border-navy/15 bg-soft p-3 text-sm text-navy/70 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-navy border-b border-navy/10 pb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs text-white">2</span>
                Payment Method
              </h2>

              <div className="mt-5 space-y-4">
                {/* Razorpay option */}
                <label
                  className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'razorpay'
                      ? 'border-navy bg-navy/5 shadow-sm'
                      : 'border-navy/15 bg-white hover:border-navy/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 accent-navy"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy text-sm sm:text-base flex items-center gap-2">
                        <CreditCard size={18} className="text-gold-dark" /> Online Payment (Razorpay)
                      </span>
                      <span className="rounded bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5">
                        INSTANT
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-navy/65">
                      Pay securely via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, or Wallets.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-navy/50 bg-soft px-2 py-1 rounded">UPI / QR</span>
                      <span className="text-[10px] font-semibold text-navy/50 bg-soft px-2 py-1 rounded">Visa / Mastercard / RuPay</span>
                      <span className="text-[10px] font-semibold text-navy/50 bg-soft px-2 py-1 rounded">NetBanking</span>
                    </div>
                  </div>
                </label>

                {/* COD option */}
                <label
                  className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-navy bg-navy/5 shadow-sm'
                      : 'border-navy/15 bg-white hover:border-navy/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-navy"
                  />
                  <div>
                    <span className="font-bold text-navy text-sm sm:text-base flex items-center gap-2">
                      <Truck size={18} className="text-gold-dark" /> Cash on Delivery (COD)
                    </span>
                    <p className="mt-1 text-xs text-navy/65">
                      Pay in cash upon doorstep delivery of your Texora order.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-md sticky top-28">
              <h2 className="text-xl font-bold text-navy border-b border-navy/10 pb-4">
                Order Review
              </h2>

              {/* Items preview list */}
              <div className="mt-4 max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-bold text-navy shrink-0">{item.quantity}x</span>
                      <span className="truncate font-medium text-navy/80">{item.product.name}</span>
                    </div>
                    <span className="font-semibold text-navy shrink-0 ml-2">
                      ₹{((item.price || 499) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-5 space-y-2 text-xs border-t border-navy/10 pt-4">
                <div className="flex justify-between text-navy/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-navy">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-navy/70">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="font-semibold text-navy">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-navy/70">
                  <span>Shipping</span>
                  <span className="font-semibold text-navy">
                    {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-navy border-t border-navy/10 pt-3 mt-2">
                  <span>Grand Total</span>
                  <span className="text-navy">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-navy to-navy-dark px-6 py-4 text-sm font-bold text-white transition hover:opacity-95 shadow-lg disabled:opacity-60"
              >
                {loading ? (
                  <span>Processing Order...</span>
                ) : paymentMethod === 'razorpay' ? (
                  <>
                    <ShieldCheck size={18} /> Pay ₹{grandTotal.toLocaleString('en-IN')} via Razorpay
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} /> Confirm COD Order (₹{grandTotal.toLocaleString('en-IN')})
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-navy/50 text-center">
                <ShieldCheck size={14} className="text-gold-dark" />
                <span>Protected by Texora Buyer Protection</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
