import api from './axios'
import { saveLocalOrder, getLocalOrders } from '../utils/localOrders'

export const createOrder = async (payload, token) => {
  try {
    const res = await api.post('/orders/create', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    console.warn('Order API failed, saving locally:', err.message)
    const localOrder = {
      _id: `local_${Date.now()}`,
      items: payload.items,
      amount: payload.amount,
      address: payload.address,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
    }
    saveLocalOrder(localOrder)
    if (payload.paymentMethod === 'razorpay') {
      return {
        order: localOrder,
        razorpayOrder: {
          id: `mock_order_${Date.now()}`,
          amount: Math.round(payload.amount * 100),
          currency: 'INR',
        },
        offline: true,
      }
    }
    return { order: localOrder, offline: true }
  }
}

export const verifyPayment = async (data, token) => {
  try {
    const res = await api.post('/orders/verify', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    console.warn('Payment verify failed (offline mode):', err.message)
    return { message: 'Payment recorded locally', offline: true }
  }
}

export const getUserOrders = async (token) => {
  try {
    const res = await api.get('/orders/user', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  } catch (err) {
    console.warn('Orders fetch failed, using local orders:', err.message)
    return getLocalOrders()
  }
}
