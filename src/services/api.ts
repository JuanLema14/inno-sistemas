import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(/(^| )token=([^;]+)/)
  return match ? match[2] : null
}

export default api
