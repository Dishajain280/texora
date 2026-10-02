import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../utils/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      toast.success(`Order status updated to ${status}`)
      fetchOrders()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status')
    }
  }

  const handlePaymentStatusChange = async (orderId, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { paymentStatus })
      toast.success(`Payment status updated to ${paymentStatus}`)
      fetchOrders()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update payment status')
    }
  }

  if (loading) return <div className="p-6">Loading orders...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Customer Orders</h1>
          <p className="text-sm text-navy/60">Manage e-commerce orders, payment verification, and delivery status</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-navy/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-soft text-xs uppercase font-bold text-navy/70 border-b border-navy/10">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/10 text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-soft/50">
                  <td className="py-3 px-4">
                    <p className="font-bold text-navy">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-navy/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-semibold text-navy">{order.shippingAddress?.name || order.user?.name || 'Guest User'}</p>
                    <p className="text-xs text-navy/60">{order.shippingAddress?.email || order.user?.email}</p>
                    <p className="text-xs text-navy/50">📞 {order.shippingAddress?.phone}</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-medium text-navy text-xs">
                      {order.products?.map((p) => `${p.quantity}x ${p.name || 'Product'}`).join(', ')}
                    </p>
                  </td>

                  <td className="py-3 px-4 font-bold text-navy">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold block uppercase text-navy/70">
                        {order.paymentMethod === 'razorpay' ? '💳 Razorpay' : '💵 COD'}
                      </span>
                      <select
                        value={order.paymentStatus || 'pending'}
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded border outline-none ${
                          order.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs font-semibold px-2 py-1 rounded border border-navy/20 bg-white text-navy outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-navy/50">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
