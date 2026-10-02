import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Calendar, CreditCard, ArrowRight, ShoppingBag, Eye } from 'lucide-react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

export default function MyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/orders/my-orders')
        setOrders(data)
      } catch (err) {
        console.error('Failed to fetch user orders', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyOrders()
  }, [])

  if (loading) {
    return (
      <main className="min-h-[80vh] bg-soft px-4 pb-16 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-5xl space-y-4 animate-pulse">
          <div className="h-8 w-48 rounded bg-navy/10" />
          <div className="h-32 rounded-2xl bg-white border border-navy/10" />
          <div className="h-32 rounded-2xl bg-white border border-navy/10" />
        </div>
      </main>
    )
  }

  return (
    <main className="bg-soft min-h-screen px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-navy/10 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
              Account
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              My Orders
            </h1>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-gold-dark"
          >
            Shop More <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-navy/10 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy/5 text-navy mb-4">
              <Package size={40} className="text-navy/40" />
            </div>
            <h2 className="text-2xl font-bold text-navy">No Orders Found</h2>
            <p className="mt-2 text-sm text-navy/60 max-w-md mx-auto">
              You haven't placed any Texora garment or fabric orders yet.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-sm font-bold text-white transition hover:bg-gold-dark hover:text-navy"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const isPaid = order.paymentStatus === 'paid'

              return (
                <div
                  key={order._id}
                  className="rounded-2xl border border-navy/10 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-navy/10 pb-4 gap-3 text-xs">
                    <div>
                      <span className="text-navy/50 font-semibold">ORDER ID</span>
                      <p className="font-bold text-navy text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>

                    <div>
                      <span className="text-navy/50 font-semibold">DATE</span>
                      <p className="font-semibold text-navy">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div>
                      <span className="text-navy/50 font-semibold">TOTAL AMOUNT</span>
                      <p className="font-bold text-navy text-sm">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isPaid ? 'Paid' : 'Pending'}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-navy/5 text-navy text-[11px] font-bold uppercase">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft text-navy">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-navy">
                          {order.products?.length || 0} Item(s)
                        </p>
                        <p className="text-xs text-navy/60 line-clamp-1">
                          {order.products?.map((p) => p.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/order-success/${order._id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-navy/15 bg-white px-4 py-2 text-xs font-bold text-navy hover:bg-navy hover:text-white transition"
                    >
                      <Eye size={14} /> View Details
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
