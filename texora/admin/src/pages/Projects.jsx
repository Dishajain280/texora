import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'
import api from '../utils/api'

const emptyForm = { title: '', tag: '', description: '' }

export default function Projects() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    try { const { data } = await api.get('/projects'); setItems(data) }
    catch { toast.error('Failed to load projects') }
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
      if (editing) { await api.put(`/projects/${editing._id}`, form); toast.success('Project updated') }
      else { await api.post('/projects', form); toast.success('Project created') }
      setOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try { await api.delete(`/projects/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Topbar title="Projects" subtitle="Manage showcased manufacturing projects" />
        <button onClick={() => openModal()} className="btn-gold h-fit"><HiOutlinePlus /> Add Project</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead><tr><th>Title</th><th>Tag</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id}>
                <td className="font-medium text-navy">{p.title}</td>
                <td className="text-navy/60">{p.tag}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(p)} className="w-8 h-8 rounded-lg bg-soft hover:bg-gold/20 grid place-items-center text-navy"><HiOutlinePencil size={15} /></button>
                    <button onClick={() => handleDelete(p._id)} className="w-8 h-8 rounded-lg bg-soft hover:bg-red-100 hover:text-red-500 grid place-items-center text-navy"><HiOutlineTrash size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="text-center py-10 text-navy/40">No projects yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          <input required placeholder="Tag (e.g. Fashion)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="input" />
          <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input resize-none" />
          <button className="btn-gold w-full justify-center">{editing ? 'Update Project' : 'Create Project'}</button>
        </form>
      </Modal>
    </div>
  )
}
