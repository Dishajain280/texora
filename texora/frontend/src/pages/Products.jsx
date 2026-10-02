import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'

import api from '../utils/api'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [search, setSearch] = useState('')

  const urlCategory = searchParams.get('category') || 'all'

  const [selectedCategory, setSelectedCategory] =
    useState(urlCategory)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ============================================
  // SYNC CATEGORY WITH URL
  // ============================================
  useEffect(() => {
    setSelectedCategory(urlCategory)
  }, [urlCategory])

  // ============================================
  // LOAD PRODUCTS + CATEGORIES
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const [productsResponse, categoriesResponse] =
          await Promise.all([
            api.get('/products'),
            api.get('/categories'),
          ])

        // ----------------------------------------
        // PRODUCTS RESPONSE
        // ----------------------------------------
        const productData = productsResponse.data

        const productList = Array.isArray(productData)
          ? productData
          : productData?.products || productData?.data || []

        // ----------------------------------------
        // CATEGORIES RESPONSE
        // ----------------------------------------
        const categoryData = categoriesResponse.data

        const categoryList = Array.isArray(categoryData)
          ? categoryData
          : categoryData?.categories || categoryData?.data || []

        setProducts(productList)
        setCategories(categoryList)

      } catch (error) {
        console.error('Products loading error:', error)

        const message =
          error.response?.data?.message ||
          'Failed to load products'

        setError(message)
        toast.error(message)

        setProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // ============================================
  // CATEGORY CHANGE
  // ============================================
  const handleCategoryChange = (value) => {
    setSelectedCategory(value)

    if (value === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({
        category: value,
      })
    }
  }

  // ============================================
  // FILTER + SEARCH
  // ============================================
  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return products.filter((product) => {
      // ----------------------------------------
      // CATEGORY
      // ----------------------------------------
      const productCategoryId =
        product.category?._id ||
        product.category ||
        ''

      const matchesCategory =
        selectedCategory === 'all' ||
        productCategoryId === selectedCategory

      // ----------------------------------------
      // PRODUCT NAME
      // ----------------------------------------
      const productName =
        product.name?.toLowerCase() || ''

      // ----------------------------------------
      // DESCRIPTION
      // ----------------------------------------
      const productDescription =
        product.description?.toLowerCase() || ''

      // ----------------------------------------
      // CATEGORY NAME
      // ----------------------------------------
      const categoryName =
        product.category?.name?.toLowerCase() || ''

      // ----------------------------------------
      // SEARCH MATCH
      // ----------------------------------------
      const matchesSearch =
        searchText === '' ||
        productName.includes(searchText) ||
        productDescription.includes(searchText) ||
        categoryName.includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [products, search, selectedCategory])

  // ============================================
  // CLEAR FILTERS
  // ============================================
  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setSearchParams({})
  }

  const hasFilters =
    search.trim() !== '' ||
    selectedCategory !== 'all'

  return (
    <main className="min-h-screen bg-white">

      {/* ========================================
          PAGE HERO
      ======================================== */}
      <section className="bg-soft pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Our Collection
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl md:text-6xl">
              Our Products
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-navy/60 sm:text-base md:text-lg">
              Explore our collection of quality fabrics and
              garment products.
            </p>

          </div>

        </div>
      </section>

      {/* ========================================
          PRODUCTS SECTION
      ======================================== */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">

          {/* ======================================
              SEARCH + FILTER
          ====================================== */}
          <div className="mb-10 rounded-2xl border border-navy/10 bg-white p-4 shadow-sm md:p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

              {/* SEARCH */}
              <div className="relative min-w-0 flex-1">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-navy/10 bg-soft py-3 pl-11 pr-4 text-sm text-navy outline-none transition placeholder:text-navy/40 focus:border-gold focus:ring-2 focus:ring-gold/10"
                />

              </div>

              {/* CATEGORY FILTER */}
              <div className="flex min-w-0 items-center gap-3">

                <SlidersHorizontal
                  size={18}
                  className="hidden shrink-0 text-navy/40 sm:block"
                />

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    handleCategoryChange(e.target.value)
                  }
                  className="w-full min-w-0 rounded-xl border border-navy/10 bg-soft px-4 py-3 text-sm text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/10 sm:min-w-[210px]"
                >
                  <option value="all">
                    All Categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* CLEAR FILTER */}
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-navy/10 px-5 py-3 text-sm font-medium text-navy transition hover:bg-soft"
                >
                  <X size={17} />
                  Clear
                </button>
              )}

            </div>

          </div>

          {/* ======================================
              ACTIVE CATEGORY
          ====================================== */}
          {selectedCategory !== 'all' && (
            <div className="mb-6 flex items-center gap-2 text-sm text-navy/60">
              <span>Category:</span>

              <span className="font-semibold text-navy">
                {categories.find(
                  (category) =>
                    category._id === selectedCategory
                )?.name || 'Selected Category'}
              </span>
            </div>
          )}

          {/* ======================================
              RESULT COUNT
          ====================================== */}
          {!loading && !error && (
            <div className="mb-6">

              <p className="text-sm text-navy/50">
                Showing{' '}
                <span className="font-semibold text-navy">
                  {filteredProducts.length}
                </span>{' '}
                {filteredProducts.length === 1
                  ? 'product'
                  : 'products'}
              </p>

            </div>
          )}

          {/* ======================================
              LOADING
          ====================================== */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-navy/10 bg-white"
                >

                  <div className="aspect-[4/3] animate-pulse bg-soft" />

                  <div className="space-y-3 p-5">

                    <div className="h-3 w-20 animate-pulse rounded bg-soft" />

                    <div className="h-5 w-3/4 animate-pulse rounded bg-soft" />

                    <div className="h-10 w-full animate-pulse rounded bg-soft" />

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* ======================================
              ERROR
          ====================================== */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">

              <h2 className="text-lg font-semibold text-red-600">
                Unable to load products
              </h2>

              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Try Again
              </button>

            </div>
          )}

          {/* ======================================
              PRODUCTS GRID
          ====================================== */}
          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}

              </div>
            )}

          {/* ======================================
              NO PRODUCTS
          ====================================== */}
          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="rounded-2xl border border-navy/10 bg-soft px-6 py-16 text-center">

                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white">
                  <Search
                    size={24}
                    className="text-navy/40"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-navy">
                  No products found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-navy/50">
                  No products match your search or selected
                  category.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-navy transition hover:opacity-90"
                  >
                    Clear Filters
                  </button>
                )}

              </div>
            )}

        </div>
      </section>

    </main>
  )
}