import { ArrowRight, Tag, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const categoryName = product.category?.name || 'Uncategorized'
  const { addToCart } = useCart()
  const price = product.price || 499

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-navy/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div>
        {/* Image */}
        <Link
          to={`/products/${product._id}`}
          className="block overflow-hidden bg-soft"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-navy/40">
                No Image
              </div>
            )}

            {/* Featured */}
            {product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1.5 text-xs font-semibold text-navy shadow-sm">
                Featured
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-soft px-3 py-1 text-xs font-semibold text-navy">
            <Tag size={13} />
            {categoryName}
          </span>

          {/* Name */}
          <Link to={`/products/${product._id}`}>
            <h2 className="mt-2.5 line-clamp-2 text-lg font-bold text-navy transition group-hover:text-gold-dark">
              {product.name}
            </h2>
          </Link>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-navy">₹{price.toLocaleString('en-IN')}</span>
            <span className="text-xs text-navy/50">/ unit</span>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between border-t border-navy/10 p-5 pt-3">
        <Link
          to={`/products/${product._id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition hover:text-gold-dark"
        >
          Details
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <button
          onClick={() => addToCart(product)}
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-gold-dark hover:text-navy"
        >
          <ShoppingBag size={14} />
          Add to Cart
        </button>
      </div>
    </article>
  )
}