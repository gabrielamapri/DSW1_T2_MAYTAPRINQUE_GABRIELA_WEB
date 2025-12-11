import axios from 'axios'

const base = import.meta.env.VITE_API_URL ?? 'http://localhost:5185'

const api = axios.create({
  baseURL: `${base}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

export default api
