import api from './axios'

export const createRazorpayOrder = (data) => api.post('/orders/create', data)
export const verifyPayment = (data) => api.post('/orders/verify', data)

