export const COUPONS = {
  PREMIUM10: { code: 'PREMIUM10', label: '10% off', type: 'percent', value: 10, minSubtotal: 50 },
  WELCOME20: { code: 'WELCOME20', label: '$20 off', type: 'fixed', value: 20, minSubtotal: 100 },
  FREESHIP: { code: 'FREESHIP', label: 'Free shipping', type: 'freeship', value: 0, minSubtotal: 0 },
}

export const FREE_SHIPPING_THRESHOLD = 150
export const STANDARD_SHIPPING = 12.99
export const TAX_RATE = 0.1

export function validateCoupon(code, subtotal) {
  const key = (code || '').trim().toUpperCase()
  const coupon = COUPONS[key]
  if (!coupon) return { valid: false, message: 'Invalid coupon code' }
  if (subtotal < coupon.minSubtotal) {
    return { valid: false, message: `Minimum order $${coupon.minSubtotal} required` }
  }
  return { valid: true, coupon }
}

export function calculateOrderTotals(subtotal, couponCode = '') {
  const sub = Math.max(0, Number(subtotal) || 0)
  let discount = 0
  let shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING
  let appliedCoupon = null

  if (couponCode) {
    const { valid, coupon, message } = validateCoupon(couponCode, sub)
    if (valid && coupon) {
      appliedCoupon = coupon
      if (coupon.type === 'percent') {
        discount = (sub * coupon.value) / 100
      } else if (coupon.type === 'fixed') {
        discount = Math.min(coupon.value, sub)
      } else if (coupon.type === 'freeship') {
        shipping = 0
      }
    } else {
      return { subtotal: sub, discount: 0, shipping, tax: 0, total: sub, appliedCoupon: null, couponError: message }
    }
  }

  const afterDiscount = Math.max(0, sub - discount)
  const tax = afterDiscount * TAX_RATE
  const total = afterDiscount + shipping + tax

  return {
    subtotal: sub,
    discount,
    shipping,
    tax,
    total,
    appliedCoupon,
    couponError: null,
  }
}
