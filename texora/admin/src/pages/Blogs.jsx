import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import Topbar from '../components/Topbar'
import Modal from '../components/Modal'
import api from '../utils/api'

const emptyForm = { title: '', excerpt: '', content: '', author: 'Admin', day: '', month: '' }

export default function Blogs() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const load = async () => {
    try { const { data } = await api.get('/blogs'); setItems(data) }
    catch { toast.error('Failed to load blog posts') }
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
      if (editing) { await api.put(`/blogs/${editing._id}`, form); toast.success('Post updated') }
      else { await api.post('/blogs', form); toast.success('Post created') }
      setOpen(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Action failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try { await api.delete(`/blogs/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <Topbar title="Blog Posts" subtitle="Manage articles and industry insights" />
        <button onClick={() => openModal()} className="btn-gold h-fit"><HiOutlinePlus /> Add Post</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead><tr><th>Title</th><th>Author</th><th>Comments</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((b) => (
              <tr key={b._id}>
                <td className="font-medium text-navy max-w-sm truncate">{b.title}</td>
                <td className="text-navy/60">{b.author}</td>
                <td className="text-navy/60">{b.comments}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(b)} className="w-8 h-8 rounded-lg bg-soft hover:bg-gold/20 grid place-items-center text-navy"><HiOutlinePencil size={15} /></button>
                    <button onClick={() => handleDelete(b._id)} className="w-8 h-8 rounded-lg bg-soft hover:bg-red-100 hover:text-red-500 grid place-items-center text-navy"><HiOutlineTrash size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-navy/40">No blog posts yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Post' : 'Add Post'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          <textarea required placeholder="Excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="input resize-none" />
          <textarea required placeholder="Full Content" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="input resize-none" />
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="input" />
            <input placeholder="Day (21)" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="input" />
            <input placeholder="Month (July)" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="input" />
          </div>
          <button className="btn-gold w-full justify-center">{editing ? 'Update Post' : 'Create Post'}</button>
        </form>
      </Modal>
    </div>
  )
}
