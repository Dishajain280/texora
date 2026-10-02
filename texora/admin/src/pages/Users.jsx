import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { HiOutlineTrash } from 'react-icons/hi'
import Topbar from '../components/Topbar'
import api from '../utils/api'

export default function Users() {
  const [items, setItems] = useState([])

  const load = async () => {
    try { const { data } = await api.get('/users'); setItems(data) }
    catch { toast.error('Failed to load users') }
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try { await api.delete(`/users/${id}`); toast.success('Deleted'); load() }
    catch { toast.error('Delete failed') }
  }

  const changeRole = async (id, role) => {
    try { await api.put(`/users/${id}/role`, { role }); toast.success('Role updated'); load() }
    catch { toast.error('Failed') }
  }

  return (
    <div>
      <Topbar title="Users" subtitle="Manage registered customer & admin accounts" />
      <div className="card overflow-x-auto">
        <table className="table-base">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((u) => (
              <tr key={u._id}>
                <td className="font-medium text-navy">{u.name}</td>
                <td className="text-navy/60">{u.email}</td>
                <td>
                  <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className="text-xs border border-navy/10 rounded-lg px-2 py-1">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="text-navy/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(u._id)} className="w-8 h-8 rounded-lg bg-soft hover:bg-red-100 hover:text-red-500 grid place-items-center text-navy"><HiOutlineTrash size={15} /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-navy/40">No users yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
