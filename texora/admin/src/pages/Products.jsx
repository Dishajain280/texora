import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
} from 'react-icons/hi'

import Topbar from '../components/Topbar'
import Modal from '../components/Modal'
import api from '../utils/api'

const emptyForm = {
  name: '',
  category: '',
  description: '',
  specifications: [
    { name: '', value: '' },
    { name: '', value: '' },
    { name: '', value: '' },
  ],
  featured: false,
  image: null,
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)

  // Load products
  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load products'
      )
    }
  }

  // Load categories
  const loadCategories = async () => {
    try {
      const { data } = await api.get('/categories')
      setCategories(data)
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load categories'
      )
    }
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  // Open add/edit modal
  const openModal = (product = null) => {
    if (product) {
      setEditing(product)

      setForm({
                name: product.name || '',
                category: product.category?._id || product.category || '',
                description: product.description || '',
                specifications:
                  product.specifications?.length === 3
                    ? product.specifications.map((spec) => ({
                        name: spec.name || '',
                        value: spec.value || '',
                      }))
                    : [
                        { name: '', value: '' },
                        { name: '', value: '' },
                        { name: '', value: '' },
                      ],
                featured: product.featured || false,
                image: null,
              })

      setPreview(product.image || '')
    } else {
      setEditing(null)
      setForm(emptyForm)
      setPreview('')
    }

    setOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setOpen(false)
    setEditing(null)
    setForm(emptyForm)
    setPreview('')
  }

  // Form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setForm((prev) => ({
      ...prev,
      image: file,
    }))

    setPreview(URL.createObjectURL(file))
  }

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.category) {
      toast.error('Please select a category')
      return
    }

    if (!editing && !form.image) {
      toast.error('Please select a product image')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append('name', form.name)
      formData.append('category', form.category)
      formData.append('description', form.description)

      formData.append(
        'specifications',
        JSON.stringify(form.specifications)
      )

      formData.append('featured', form.featured)

      if (form.image) {
        formData.append('image', form.image)
      }

      if (editing) {
        await api.put(`/products/${editing._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast.success('Product updated successfully')
      } else {
        await api.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        toast.success('Product created successfully')
      }

      closeModal()
      await loadProducts()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Product action failed'
      )
    } finally {
      setLoading(false)
    }
  }

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await api.delete(`/products/${id}`)

      toast.success('Product deleted successfully')

      await loadProducts()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete product'
      )
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Topbar
          title="Products"
          subtitle="Manage your fabric & garment catalog"
        />

        <button
          onClick={() => openModal()}
          className="btn-gold h-fit"
        >
          <HiOutlinePlus size={18} />
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-navy/50">Total Products</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {products.length}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-navy/50">Categories</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {categories.length}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-navy/50">Featured Products</p>
          <p className="text-2xl font-bold text-navy mt-1">
            {products.filter((product) => product.featured).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Specifications</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                {/* Image */}
                <td>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-navy/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-soft grid place-items-center text-xs text-navy/40">
                      No Image
                    </div>
                  )}
                </td>

                {/* Name */}
                <td>
                  <p className="font-semibold text-navy">
                    {product.name}
                  </p>
                </td>

                {/* Category */}
                <td>
                  <span className="text-navy/60">
                    {product.category?.name || '-'}
                  </span>
                </td>

               <td>
                  <div className="space-y-1">
                    {product.specifications?.map((spec, index) => (
                      <div key={index} className="text-xs text-navy/60">
                        <span className="font-medium text-navy">
                          {spec.name}:
                        </span>{' '}
                        {spec.value}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Featured */}
                <td>
                  {product.featured ? (
                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-gold/20 text-navy text-xs font-semibold">
                      Featured
                    </span>
                  ) : (
                    <span className="text-navy/40 text-xs">
                      No
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="w-8 h-8 rounded-lg bg-soft hover:bg-gold/20 grid place-items-center text-navy"
                      title="Edit"
                    >
                      <HiOutlinePencil size={15} />
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="w-8 h-8 rounded-lg bg-soft hover:bg-red-100 hover:text-red-500 grid place-items-center text-navy"
                      title="Delete"
                    >
                      <HiOutlineTrash size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-navy/40"
                >
                  No products yet. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit Product' : 'Add Product'}
      >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Product Name
          </label>

          <input
            required
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Category
          </label>

          <select
            required
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input bg-white"
          >
            <option value="">
              Select Category
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

          {categories.length === 0 && (
            <p className="text-xs text-red-500 mt-1.5">
              Create a category first.
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Description
          </label>

          <textarea
            required
            name="description"
            placeholder="Enter product description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="input resize-none"
          />
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            Specifications
          </label>

          <div className="space-y-3">
            {form.specifications.map((specification, index) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-3"
              >
                {/* Attribute Name */}
                <input
                  required
                  type="text"
                  placeholder={`Attribute ${index + 1}`}
                  value={specification.name}
                  onChange={(e) => {
                    const updatedSpecifications = [
                      ...form.specifications,
                    ]

                    updatedSpecifications[index] = {
                      ...updatedSpecifications[index],
                      name: e.target.value,
                    }

                    setForm({
                      ...form,
                      specifications: updatedSpecifications,
                    })
                  }}
                  className="input"
                />

                {/* Attribute Value */}
                <input
                  required
                  type="text"
                  placeholder={`Value ${index + 1}`}
                  value={specification.value}
                  onChange={(e) => {
                    const updatedSpecifications = [
                      ...form.specifications,
                    ]

                    updatedSpecifications[index] = {
                      ...updatedSpecifications[index],
                      value: e.target.value,
                    }

                    setForm({
                      ...form,
                      specifications: updatedSpecifications,
                    })
                  }}
                  className="input"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-navy/60 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-soft file:text-navy file:font-medium hover:file:bg-gold/20"
          />

          {/* Image Preview */}
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Product preview"
                className="w-full h-48 object-cover rounded-xl border border-navy/10"
              />
            </div>
          )}
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-[#F2C230]"
          />

          <span className="text-sm font-medium text-navy">
            Mark as Featured Product
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || categories.length === 0}
          className="btn-gold w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Saving...'
            : editing
              ? 'Update Product'
              : 'Create Product'}
        </button>

      </form>
      </Modal>
    </div>
  )
}