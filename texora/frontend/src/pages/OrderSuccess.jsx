import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react'
import api from '../utils/api'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const { data } = await api.get(`/orders/${id}`)
        setOrder(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchOrder()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-soft px-4 pb-16 pt-32 grid place-items-center">
        <div className="text-center animate-pulse">
          <div className="h-16 w-16 mx-auto rounded-full bg-navy/10 mb-4" />
          <div className="h-6 w-48 mx-auto rounded bg-navy/10 mb-2" />
          <div className="h-4 w-64 mx-auto rounded bg-navy/10" />
        </div>
      </main>
    )
  }

  const isPaid = order?.paymentStatus === 'paid'

  return (
    <main className="bg-soft min-h-screen px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-4xl">
        {/* Success Header Card */}
        <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-10 shadow-lg text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-green-600 mb-4 shadow-sm animate-bounce">
            <CheckCircle size={44} />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
            Order Confirmed
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Thank You For Your Order!
          </h1>

          <p className="mt-2 text-sm text-navy/65 max-w-lg mx-auto">
            We have received your order #{order?._id ? order._id.slice(-8).toUpperCase() : id}. We're preparing your garment & textile shipment!
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-soft p-3 text-xs font-semibold text-navy">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-navy/50" />
              Date: {new Date(order?.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CreditCard size={14} className="text-navy/50" />
              Method: {order?.paymentMethod === 'razorpay' ? 'Razorpay Online' : 'Cash on Delivery'}
            </span>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {isPaid ? 'Paid' : 'Pending Payment'}
            </span>
          </div>

          {/* Delivery Stepper */}
          <div className="mt-10 border-t border-navy/10 pt-8">
            <h3 className="text-sm font-bold text-navy text-left mb-6">Delivery Progress</h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="space-y-2">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-navy text-white font-bold shadow-md">
                  <CheckCircle size={18} />
                </div>
                <p className="font-bold text-navy">Placed</p>
              </div>

              <div className="space-y-2">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-gold text-navy font-bold shadow-md">
                  <Package size={18} />
                </div>
                <p className="font-bold text-navy">Processing</p>
              </div>

              <div className="space-y-2">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-soft text-navy/40 font-bold border border-navy/10">
                  <Truck size={18} />
                </div>
                <p className="font-semibold text-navy/40">Shipped</p>
              </div>

              <div className="space-y-2">
                <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-soft text-navy/40 font-bold border border-navy/10">
                  <MapPin size={18} />
                </div>
                <p className="font-semibold text-navy/40">Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details & Address */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Purchased Items */}
          <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-navy border-b border-navy/10 pb-3 flex items-center gap-2">
              <ShoppingBag size={18} /> Ordered Items
            </h3>

            <div className="mt-4 divide-y divide-navy/10 max-h-72 overflow-y-auto">
              {order?.products?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-navy">{item.name || item.product?.name || 'Textile Product'}</p>
                    <p className="text-navy/50">Qty: {item.quantity} x ₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="font-bold text-navy">
                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-navy/10 pt-3 flex justify-between font-bold text-navy text-sm">
              <span>Total Amount Paid</span>
              <span>₹{order?.totalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-navy border-b border-navy/10 pb-3 flex items-center gap-2">
              <MapPin size={18} /> Shipping Address
            </h3>

            {order?.shippingAddress && (
              <div className="mt-4 text-xs text-navy/80 space-y-1.5 leading-relaxed">
                <p className="font-bold text-navy text-sm">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <div className="pt-2 text-navy/60">
                  <p>📧 {order.shippingAddress.email}</p>
                  <p>📞 {order.shippingAddress.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-gold-dark hover:text-navy shadow-md"
          >
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-2 rounded-xl border border-navy/20 bg-white px-6 py-3 text-sm font-bold text-navy transition hover:bg-soft"
          >
            View All My Orders
          </Link>
        </div>
      </div>
    </main>
  )
}
