const KEY = 'local_orders'

export function saveLocalOrder(order) {
  const list = getLocalOrders()
  list.unshift({
    ...order,
    _id: order._id || `local_${Date.now()}`,
    createdAt: order.createdAt || new Date().toISOString(),
    orderStatus: order.orderStatus || 'pending',
    paymentStatus: order.paymentMethod === 'cod' ? 'pending' : order.paymentStatus || 'paid',
  })
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)))
}

export function getLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
