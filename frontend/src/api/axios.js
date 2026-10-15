import axios from 'axios'
import { toast } from 'react-toastify'
import logger from '../utils/logger'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const MAX_RETRIES = 2
const RETRY_DELAY = 800

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const shouldRetry = (error) => {
  const status = error.response?.status
  return (
    !error.response ||
    status === 408 ||
    status === 429 ||
    (status >= 500 && status < 600)
  )
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.metadata = { retryCount: config.metadata?.retryCount || 0 }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config
    if (!config || config._noRetry) return Promise.reject(error)

    config.metadata = config.metadata || { retryCount: 0 }

    if (config.metadata.retryCount < MAX_RETRIES && shouldRetry(error)) {
      config.metadata.retryCount += 1
      logger.warn(`API retry ${config.metadata.retryCount}/${MAX_RETRIES}`, config.url)
      await sleep(RETRY_DELAY * config.metadata.retryCount)
      return api(config)
    }

    if (!error.response && !config._silent) {
      logger.warn('API offline — using client fallbacks where available', config.url)
    }

    if (error.response?.status === 401 && !config.url?.includes('/auth/login')) {
      logger.debug('Unauthorized request', config.url)
    }

    return Promise.reject(error)
  }
)

export const notifyApiFallback = (message = 'Using offline catalog data') => {
  toast.info(message, { toastId: 'api-fallback', autoClose: 2500 })
}

export default api
