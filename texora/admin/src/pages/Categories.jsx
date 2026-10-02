// admin/src/pages/Categories.jsx
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhotograph,
  HiOutlineRefresh,
} from 'react-icons/hi'
import Modal from '../components/Modal'
import api from '../utils/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const [form, setForm] = useState({
    name: '',
    image: null,
  })

  const [imagePreview, setImagePreview] = useState('')

  // =========================
  // GET ALL CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      setLoading(true)

      const { data } = await api.get('/categories')

      setCategories(data)
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to load categories'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // =========================
  // OPEN ADD MODAL
  // =========================
  const openAddModal = () => {
    setEditingCategory(null)

    setForm({
      name: '',
      image: null,
    })

    setImagePreview('')
    setModalOpen(true)
  }

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const openEditModal = (category) => {
    setEditingCategory(category)

    setForm({
      name: category.name || '',
      image: null,
    })

    setImagePreview(category.image || '')
    setModalOpen(true)
  }

  // =========================
  // CLOSE FORM MODAL
  // =========================
  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingCategory(null)

    setForm({
      name: '',
      image: null,
    })

    setImagePreview('')
  }

  // =========================
  // FORM INPUT
  // =========================
  const handleNameChange = (e) => {
    setForm((prev) => ({
      ...prev,
      name: e.target.value,
    }))
  }

  // =========================
  // IMAGE SELECT
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }))

    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error('Category name is required')
      return
    }

    if (!editingCategory && !form.image) {
      toast.error('Category thumbnail image is required')
      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append('name', form.name.trim())

      if (form.image) {
        formData.append('image', form.image)
      }

      if (editingCategory) {
        const { data } = await api.put(
          `/categories/${editingCategory._id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        setCategories((prev) =>
          prev.map((category) =>
            category._id === data._id ? data : category
          )
        )

        toast.success('Category updated successfully')
      } else {
        const { data } = await api.post('/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        setCategories((prev) => [data, ...prev])

        toast.success('Category added successfully')
      }

      closeModal()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to ${editingCategory ? 'update' : 'add'} category`
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // DELETE MODAL
  // =========================
  const openDeleteModal = (category) => {
    setCategoryToDelete(category)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    if (deletingId) return

    setDeleteModalOpen(false)
    setCategoryToDelete(null)
  }

  // =========================
  // DELETE CATEGORY
  // =========================
  const handleDelete = async () => {
    if (!categoryToDelete) return

    try {
      setDeletingId(categoryToDelete._id)

      await api.delete(`/categories/${categoryToDelete._id}`)

      setCategories((prev) =>
        prev.filter((category) => category._id !== categoryToDelete._id)
      )

      toast.success('Category deleted successfully')

      closeDeleteModal()
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete category'
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <p className="text-sm text-navy/50 font-medium">
            Product Management
          </p>

          <h1 className="text-2xl font-bold text-navy">
            Categories
          </h1>

          <p className="text-sm text-navy/50 mt-1">
            Manage your product categories and thumbnails.
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={fetchCategories}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-navy/10 bg-white text-navy font-medium hover:bg-soft transition-colors disabled:opacity-50"
          >
            <HiOutlineRefresh
              className={loading ? 'animate-spin' : ''}
              size={18}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="btn-gold"
          >
            <HiOutlinePlus size={18} />
            Add Category
          </button>

        </div>
      </div>

      {/* =========================
          STATS
      ========================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="card">
          <p className="text-sm text-navy/50">
            Total Categories
          </p>

          <p className="text-2xl font-bold text-navy mt-1">
            {categories.length}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-navy/50">
            With Images
          </p>

          <p className="text-2xl font-bold text-navy mt-1">
            {categories.filter((category) => category.image).length}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-navy/50">
            Status
          </p>

          <p className="text-2xl font-bold text-gold-dark mt-1">
            Active
          </p>
        </div>

      </div>

      {/* =========================
          CATEGORY LIST
      ========================= */}
      <div className="card">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-lg font-bold text-navy">
              All Categories
            </h2>

            <p className="text-sm text-navy/50 mt-1">
              {categories.length} categories found
            </p>
          </div>

        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />

            <p className="text-sm text-navy/50 mt-3">
              Loading categories...
            </p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-soft grid place-items-center text-navy/30">
              <HiOutlinePhotograph size={30} />
            </div>

            <h3 className="text-lg font-semibold text-navy mt-4">
              No categories yet
            </h3>

            <p className="text-sm text-navy/50 mt-1">
              Create your first product category.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="btn-gold mt-5"
            >
              <HiOutlinePlus size={18} />
              Add Category
            </button>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="table-base">

              <thead>
                <tr>
                  <th className="w-20">Image</th>
                  <th>Category Name</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>

                {categories.map((category) => (
                  <tr key={category._id}>

                    {/* IMAGE */}
                    <td>

                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-14 h-14 rounded-xl object-cover border border-navy/10"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-soft grid place-items-center text-navy/30">
                          <HiOutlinePhotograph size={22} />
                        </div>
                      )}

                    </td>

                    {/* NAME */}
                    <td>

                      <p className="font-semibold text-navy">
                        {category.name}
                      </p>

                    </td>

                    {/* DATE */}
                    <td>

                      <span className="text-sm text-navy/50">
                        {category.createdAt
                          ? new Date(category.createdAt).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : '-'}
                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td>

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => openEditModal(category)}
                          className="w-9 h-9 rounded-lg bg-soft text-navy hover:bg-gold hover:text-navy grid place-items-center transition-colors"
                          title="Edit Category"
                        >
                          <HiOutlinePencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(category)}
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white grid place-items-center transition-colors"
                          title="Delete Category"
                        >
                          <HiOutlineTrash size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* CATEGORY NAME */}
          <div>

            <label className="block text-sm font-semibold text-navy mb-2">
              Category Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Bed Sheets"
              className="input"
              disabled={saving}
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="block text-sm font-semibold text-navy mb-2">
              Category Thumbnail
            </label>

            <label className="block cursor-pointer">

              <div className="border-2 border-dashed border-navy/10 rounded-2xl p-5 hover:border-gold transition-colors">

                {imagePreview ? (
                  <div className="space-y-3">

                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />

                    <p className="text-center text-xs text-navy/50">
                      Click to choose another image
                    </p>

                  </div>
                ) : (
                  <div className="py-8 text-center">

                    <div className="w-12 h-12 mx-auto rounded-xl bg-soft grid place-items-center text-navy/40">
                      <HiOutlinePhotograph size={24} />
                    </div>

                    <p className="text-sm font-medium text-navy mt-3">
                      Upload thumbnail
                    </p>

                    <p className="text-xs text-navy/40 mt-1">
                      PNG, JPG, JPEG up to 5MB
                    </p>

                  </div>
                )}

              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={saving}
              />

            </label>

            {editingCategory && (
              <p className="text-xs text-navy/40 mt-2">
                Leave the image unchanged if you don't want to replace it.
              </p>
            )}

          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl border border-navy/10 text-navy font-semibold hover:bg-soft transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn-gold disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <HiOutlinePlus size={18} />
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </>
              )}
            </button>

          </div>

        </form>

      </Modal>

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}
      <Modal
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Category"
      >

        <div className="space-y-5">

          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 grid place-items-center">
            <HiOutlineTrash size={24} />
          </div>

          <div>

            <h3 className="text-lg font-bold text-navy">
              Delete "{categoryToDelete?.name}"?
            </h3>

            <p className="text-sm text-navy/50 mt-2 leading-6">
              This category will be permanently removed from your category
              list.
            </p>

          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={deletingId}
              className="px-5 py-2.5 rounded-xl border border-navy/10 text-navy font-semibold hover:bg-soft transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deletingId}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
            >
              {deletingId ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <HiOutlineTrash size={18} />
                  Delete
                </>
              )}
            </button>

          </div>

        </div>

      </Modal>

    </div>
  )
}