import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'
import api from '../utils/api'

const emptyForm = { title: '', description: '', icon: 'GiWeight', order: 0 }

export default function Services() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    try { const { data } = await api.get('/services'); setItems(data) }
    catch { toast.error('Failed to load services') }
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
      if (editing) { await api.put(`/services/${editing._id}`, form); toast.success('Service updated') }
      else { await api.post('/services', form); toast.success('Service created') }
      setOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try { await api.delete(`/services/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Topbar title="Services" subtitle="Manage the services shown on your website" />
        <button onClick={() => openModal()} className="btn-gold h-fit"><HiOutlinePlus /> Add Service</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((s) => (
          <div key={s._id} className="card">
            <h4 className="font-heading font-semibold text-navy mb-2">{s.title}</h4>
            <p className="text-sm text-navy/55 mb-4 line-clamp-2">{s.description}</p>
            <div className="flex gap-2">
              <button onClick={() => openModal(s)} className="w-8 h-8 rounded-lg bg-soft hover:bg-gold/20 grid place-items-center text-navy"><HiOutlinePencil size={15} /></button>
              <button onClick={() => handleDelete(s._id)} className="w-8 h-8 rounded-lg bg-soft hover:bg-red-100 hover:text-red-500 grid place-items-center text-navy"><HiOutlineTrash size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-navy/40 col-span-full text-center py-10">No services yet.</p>}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
          <input placeholder="Icon name (e.g. GiWeight)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input" />
          <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className="input" />
          <button className="btn-gold w-full justify-center">{editing ? 'Update Service' : 'Create Service'}</button>
        </form>
      </Modal>
    </div>
  )
}
