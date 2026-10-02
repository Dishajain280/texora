import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartSubtotal } = useCart()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const subtotal = getCartSubtotal()
  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 99
  const tax = Math.round(subtotal * 0.05) // 5% GST
  const grandTotal = Math.max(0, subtotal + shipping + tax - discount)

  const handleApplyPromo = (e) => {
    e.preventDefault()
    if (!promoCode.trim()) return

    if (promoCode.toUpperCase() === 'TEXORA10') {
      const disc = Math.round(subtotal * 0.1)
      setDiscount(disc)
      toast.success('Promo code TEXORA10 applied! (10% Off)')
    } else if (promoCode.toUpperCase() === 'WELCOME100') {
      setDiscount(100)
      toast.success('Promo code WELCOME100 applied! (₹100 Off)')
    } else {
      toast.error('Invalid or expired promo code')
    }
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-[80vh] bg-soft px-4 pb-16 pt-32 sm:px-6 sm:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-navy/5 text-navy">
            <ShoppingBag size={48} className="text-navy/40" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-navy sm:text-4xl">
            Your Cart is Empty
          </h1>
          <p className="mt-3 text-sm text-navy/60 sm:text-base max-w-md mx-auto">
            Looks like you haven't added any garment or textile products to your cart yet. Explore our high-quality collection!
          </p>
          <div className="mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-8 py-3.5 text-sm font-bold text-white transition hover:bg-gold-dark hover:text-navy shadow-lg"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-soft min-h-screen px-4 pb-20 pt-32 sm:px-6 sm:pt-36">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-navy/10 pb-6 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
              Texora Store
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition"
          >
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Layout */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          {/* Cart Items List */}
          <div className="space-y-4">
            {cart.map((item) => {
              const product = item.product
              const price = item.price || 499

              return (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-navy/10 bg-white p-4 sm:p-5 shadow-sm transition hover:border-navy/20"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/products/${product._id}`}
                      className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-navy/10 bg-soft p-1"
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-xs text-navy/40">
                          No Image
                        </div>
                      )}
                    </Link>

                    <div>
                      <Link
                        to={`/products/${product._id}`}
                        className="text-base font-bold text-navy hover:text-gold-dark transition"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-xs text-navy/50">
                        Price per unit: ₹{price.toLocaleString('en-IN')}
                      </p>
                      <p className="mt-1 text-sm font-bold text-navy">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-navy/10">
                    <div className="flex items-center rounded-xl border border-navy/15 bg-white p-1">
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-soft grid place-items-center text-navy hover:bg-navy hover:text-white transition"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-navy">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-soft grid place-items-center text-navy hover:bg-navy hover:text-white transition"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="p-2 text-navy/40 hover:text-red-600 transition"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Back link */}
            <div className="pt-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark transition"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-md">
              <h2 className="text-xl font-bold text-navy border-b border-navy/10 pb-4">
                Order Summary
              </h2>

              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="mt-5">
                <label className="block text-xs font-semibold text-navy/70 mb-1.5">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. TEXORA10"
                      className="w-full rounded-xl border border-navy/15 bg-soft py-2 pl-9 pr-3 text-xs uppercase font-semibold text-navy outline-none focus:border-navy"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-gold-dark hover:text-navy"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="mt-1.5 text-xs text-green-600 font-semibold">
                    ✓ Promo discount applied (-₹{discount})
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="mt-6 space-y-3 text-sm border-t border-navy/10 pt-4">
                <div className="flex justify-between text-navy/70">
                  <span>Subtotal</span>
                  <span className="font-semibold text-navy">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-navy/70">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="font-semibold text-navy">
                    ₹{tax.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-navy/70">
                  <span>Shipping Fee</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="font-bold text-green-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-navy">₹{shipping}</span>
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold text-navy border-t border-navy/10 pt-3">
                  <span>Total Amount</span>
                  <span className="text-navy">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-navy to-navy-dark px-6 py-4 text-sm font-bold text-white transition hover:opacity-95 shadow-lg"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="rounded-2xl border border-navy/10 bg-white p-5 space-y-3 text-xs text-navy/75">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-gold-dark shrink-0" />
                <span>100% Secure Razorpay Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={20} className="text-gold-dark shrink-0" />
                <span>Free express shipping on orders over ₹1,500</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={20} className="text-gold-dark shrink-0" />
                <span>7-Day Quality Guarantee & Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
