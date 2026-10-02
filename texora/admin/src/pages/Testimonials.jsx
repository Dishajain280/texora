import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'
import api from '../utils/api'

const emptyForm = { name: '', role: '', text: '', rating: 5 }

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    try { const { data } = await api.get('/testimonials'); setItems(data) }
    catch { toast.error('Failed to load testimonials') }
  }
  useEffect(() => { load() }, [])

  const openModal = (item = null) => {
    setEditing(item)
    setForm(item ? { ...item } : emptyForm)
    setOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) { await api.put(`/testimonials/${editing._id}`, form); toast.success('Testimonial updated') }
      else { await api.post('/testimonials', form); toast.success('Testimonial created') }
      setOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try { await api.delete(`/testimonials/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Topbar title="Testimonials" subtitle="Manage customer reviews shown on the homepage" />
        <button onClick={() => openModal()} className="btn-gold h-fit"><HiOutlinePlus /> Add Testimonial</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t) => (
          <div key={t._id} className="card">
            <p className="text-sm text-navy/60 mb-4 line-clamp-3">"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-navy text-sm">{t.name}</p>
                <p className="text-xs text-navy/40">{t.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal(t)} className="w-8 h-8 rounded-lg bg-soft hover:bg-gold/20 grid place-items-center text-navy"><HiOutlinePencil size={15} /></button>
                <button onClick={() => handleDelete(t._id)} className="w-8 h-8 rounded-lg bg-soft hover:bg-red-100 hover:text-red-500 grid place-items-center text-navy"><HiOutlineTrash size={15} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-navy/40 col-span-full text-center py-10">No testimonials yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          <input required placeholder="Role / Company" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input" />
          <textarea required placeholder="Testimonial Text" rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="input resize-none" />
          <input type="number" min={1} max={5} placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input" />
          <button className="btn-gold w-full justify-center">{editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>
    </div>
  )
}
