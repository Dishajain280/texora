import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const admin = JSON.parse(localStorage.getItem('texora_admin'))
  if (admin?.token) config.headers.Authorization = `Bearer ${admin.token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('texora_admin')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
