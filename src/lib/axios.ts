import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // ajuste conforme necessário
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

export default api
