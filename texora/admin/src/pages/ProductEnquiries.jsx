import { useEffect, useState } from 'react'
import {
  Eye,
  RefreshCw,
  Search,
  X,
  Save,
  MapPin,
  Mail,
  Phone,
  Package,
  Tag,
  CalendarDays,
} from 'lucide-react'
import api from '../utils/api'

export default function ProductEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [status, setStatus] = useState('new')
  const [remark, setRemark] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchEnquiries = async () => {
    try {
      setLoading(true)

      const { data } = await api.get('/product-enquiries')

      setEnquiries(data.enquiries || [])
    } catch (error) {
      console.error('Failed to fetch enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const openEnquiry = async (id) => {
    try {
      const { data } = await api.get(`/product-enquiries/${id}`)

      const enquiry = data.enquiry

      setSelectedEnquiry(enquiry)
      setStatus(enquiry.status || 'new')
      setRemark(enquiry.remark || '')
    } catch (error) {
      console.error('Failed to fetch enquiry:', error)
    }
  }

  const closeEnquiry = () => {
    if (saving) return

    setSelectedEnquiry(null)
    setStatus('new')
    setRemark('')
  }

  const handleSave = async () => {
    if (!selectedEnquiry) return

    try {
      setSaving(true)

      const { data } = await api.put(
        `/product-enquiries/${selectedEnquiry._id}`,
        {
          status,
          remark,
        }
      )

      const updatedEnquiry = data.enquiry

      setSelectedEnquiry((prev) => ({
        ...prev,
        ...updatedEnquiry,
      }))

      setEnquiries((prev) =>
        prev.map((item) =>
          item._id === updatedEnquiry._id
            ? {
                ...item,
                status: updatedEnquiry.status,
                remark: updatedEnquiry.remark,
              }
            : item
        )
      )
    } catch (error) {
      console.error('Failed to update enquiry:', error)
    } finally {
      setSaving(false)
    }
  }

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const searchText = search.toLowerCase()

    return (
      enquiry.productName?.toLowerCase().includes(searchText) ||
      enquiry.categoryName?.toLowerCase().includes(searchText) ||
      enquiry.name?.toLowerCase().includes(searchText) ||
      enquiry.email?.toLowerCase().includes(searchText) ||
      enquiry.phone?.toLowerCase().includes(searchText)
    )
  })

  const getStatusClass = (value) => {
    if (value === 'contacted') {
      return 'bg-blue-100 text-blue-700'
    }

    if (value === 'closed') {
      return 'bg-green-100 text-green-700'
    }

    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy">
              Product Enquiries
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage customer enquiries for your products.
            </p>
          </div>

          <button
            onClick={fetchEnquiries}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-navy"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      Loading enquiries...
                    </td>
                  </tr>
                ) : filteredEnquiries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-gray-500"
                    >
                      No product enquiries found.
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <tr
                      key={enquiry._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          {enquiry.product?.image ? (
                            <img
                              src={enquiry.product.image}
                              alt={enquiry.productName}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100" />
                          )}

                          <p className="font-semibold text-navy">
                            {enquiry.productName}
                          </p>

                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                          {enquiry.categoryName}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {enquiry.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {enquiry.email}
                          </p>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {enquiry.phone}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                            enquiry.status
                          )}`}
                        >
                          {enquiry.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(
                          enquiry.createdAt
                        ).toLocaleDateString('en-IN')}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openEnquiry(enquiry._id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeEnquiry()
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-navy">
                  Enquiry Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Customer product enquiry
                </p>
              </div>

              <button
                type="button"
                onClick={closeEnquiry}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* Product */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-4">

                  {selectedEnquiry.product?.image ? (
                    <img
                      src={selectedEnquiry.product.image}
                      alt={selectedEnquiry.productName}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-xl bg-gray-200" />
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">
                      Product
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-navy">
                      {selectedEnquiry.productName}
                    </h3>

                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600">
                      <Tag size={13} />
                      {selectedEnquiry.categoryName}
                    </div>
                  </div>

                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
                  Customer Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-400">
                      Name
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {selectedEnquiry.name}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <Mail size={15} className="text-gray-400" />

                      <p className="text-xs text-gray-400">
                        Email
                      </p>
                    </div>

                    <p className="mt-1 break-all font-semibold text-gray-800">
                      {selectedEnquiry.email}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="text-gray-400" />

                      <p className="text-xs text-gray-400">
                        Phone
                      </p>
                    </div>

                    <p className="mt-1 font-semibold text-gray-800">
                      {selectedEnquiry.phone}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-gray-400" />

                      <p className="text-xs text-gray-400">
                        Date
                      </p>
                    </div>

                    <p className="mt-1 font-semibold text-gray-800">
                      {new Date(
                        selectedEnquiry.createdAt
                      ).toLocaleString('en-IN')}
                    </p>
                  </div>

                </div>
              </div>

              {/* Address */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin size={17} className="text-navy" />

                  <h3 className="text-sm font-bold uppercase tracking-wide text-navy">
                    Address
                  </h3>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selectedEnquiry.address}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-navy">
                  Customer Description
                </h3>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
                  {selectedEnquiry.description}
                </div>
              </div>

              {/* Status & Remark */}
              <div className="rounded-xl border border-gray-200 p-5">

                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">
                  Enquiry Management
                </h3>

                <div className="space-y-4">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-navy"
                    >
                      <option value="new">
                        New
                      </option>

                      <option value="contacted">
                        Contacted
                      </option>

                      <option value="closed">
                        Closed
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Remark
                    </label>

                    <textarea
                      rows="4"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      placeholder="Add a remark..."
                      className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-navy"
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={closeEnquiry}
                disabled={saving}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />

                {saving ? 'Saving...' : 'Save Changes'}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  )
}