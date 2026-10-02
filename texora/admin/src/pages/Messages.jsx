import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { HiOutlineTrash, HiOutlineMailOpen } from 'react-icons/hi'
import Topbar from '../components/Topbar'
import api from '../utils/api'

export default function Messages() {
  const [items, setItems] = useState([])

  const load = async () => {
    try { const { data } = await api.get('/contact'); setItems(data) }
    catch { toast.error('Failed to load messages') }
  }
  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    try { await api.put(`/contact/${id}/read`); load() } catch { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try { await api.delete(`/contact/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div>
      <Topbar title="Messages" subtitle="Contact form submissions from your website visitors" />

      <div className="space-y-4">
        {items.map((m) => (
          <div key={m._id} className={`card flex items-start justify-between gap-4 ${!m.isRead ? 'border-l-4 border-gold' : ''}`}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold text-navy">{m.name}</h4>
                <span className="text-xs text-navy/40">{m.email}</span>
                {!m.isRead && <span className="text-[10px] bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full font-semibold">NEW</span>}
              </div>
              <p className="text-sm font-medium text-navy/70 mb-1">{m.subject || 'General Inquiry'}</p>
              <p className="text-sm text-navy/50">{m.message}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {!m.isRead && (
                <button onClick={() => markRead(m._id)} className="w-8 h-8 rounded-lg bg-soft hover:bg-gold/20 grid place-items-center text-navy"><HiOutlineMailOpen size={15} /></button>
              )}
              <button onClick={() => handleDelete(m._id)} className="w-8 h-8 rounded-lg bg-soft hover:bg-red-100 hover:text-red-500 grid place-items-center text-navy"><HiOutlineTrash size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-navy/40 text-center py-10">No messages yet.</p>}
      </div>
    </div>
  )
}
