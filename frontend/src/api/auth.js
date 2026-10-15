import api from './axios'

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout', {}, { _silent: true })
export const profile = () => api.get('/auth/profile')
export const updateProfile = (data) => api.put('/auth/profile', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
