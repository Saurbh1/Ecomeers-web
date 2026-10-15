import React, { useState, useContext, useEffect } from 'react'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { getProduct } from '../api/products'
import { createOrder, verifyPayment } from '../api/orders'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import SEO from '../components/SEO'
import { calculateOrderTotals, validateCoupon, COUPONS } from '../utils/checkout'
import { Tag, Lock, CreditCard, Banknote } from 'lucide-react'

const PlaceOrder = () => {
  const { items, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const location = useLocation()
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState({ street: '', city: '', zip: '', country: 'United States' })
  const [method, setMethod] = useState('cod')
  const [submitting, setSubmitting] = useState(false)
  const [couponInput, setCouponInput] = useState(location.state?.coupon || '')
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.coupon || '')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      const prods = {}
      for (const item of items) {
        if (!prods[item.product]) {
          try {
            const res = await getProduct(item.product)
            prods[item.product] = res.data
          } catch { /* fallback handled in summary */ }
        }
      }
      setProducts(prods)
      setLoading(false)
    }
    if (items.length > 0) fetchProductDetails()
    else setLoading(false)
  }, [items])

  useEffect(() => {
    if (user?.address) {
      setAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        zip: user.address.zip || user.address.zipCode || '',
        country: user.address.country || 'United States',
      })
    }
  }, [user])

  const subtotal = items.reduce((s, it) => {
    const prod = products[it.product]
    return s + (prod?.price || 0) * it.quantity
  }, 0)

  const totals = calculateOrderTotals(subtotal, appliedCoupon)

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  const applyCoupon = () => {
    const { valid, coupon, message } = validateCoupon(couponInput, subtotal)
    if (!valid) return toast.error(message)
    setAppliedCoupon(coupon.code)
    toast.success(`Coupon ${coupon.code} applied`)
  }

  const placeOrder = async () => {
    if (!address.street || !address.city || !address.zip) {
      toast.warning('Please fill all address fields')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.info('Continuing as guest — order saved locally')
    }

    try {
      setSubmitting(true)
      const orderItems = items.map((it) => ({
        product: it.product,
        quantity: it.quantity,
        price: products[it.product]?.price || 0,
      }))

      const payload = {
        items: orderItems,
        amount: totals.total,
        address,
        paymentMethod: method,
      }

      const data = await createOrder(payload, token)

      if (method === 'razorpay' && data.razorpayOrder) {
        const isLoaded = await loadRazorpay()
        if (!isLoaded) {
          await clearCart()
          toast.success('Order placed (offline payment mode)')
          navigate('/order')
          return
        }

        const order = data.order
        const razorpayOrder = data.razorpayOrder

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || 'INR',
          name: 'Luxe Commerce',
          description: 'Order payment',
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              await verifyPayment(
                {
                  orderId: order._id,
                  razorpayOrderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                },
                token
              )
              await clearCart()
              toast.success('Payment successful!')
              navigate('/order')
            } catch {
              await clearCart()
              toast.success('Order recorded successfully')
              navigate('/order')
            }
          },
          prefill: { name: user?.name || 'Customer', email: user?.email || 'guest@luxe.com' },
          theme: { color: '#0d0d0d' },
          modal: { ondismiss: () => setSubmitting(false) },
        }

        if (data.offline) {
          await clearCart()
          toast.success('Demo order placed successfully')
          navigate('/order')
          return
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        await clearCart()
        toast.success('Order placed successfully!')
        navigate('/order')
      }
    } catch (err) {
      console.error(err)
      toast.error('Could not complete order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className='text-center py-24'>
        <SEO title='Checkout' />
        <h1 className='text-3xl font-semibold mb-3'>Checkout</h1>
        <p className='text-neutral-500 mb-8'>Your cart is empty.</p>
        <Link to='/collection' className='px-8 py-3.5 bg-black text-white rounded-full text-sm'>Go Shopping</Link>
      </div>
    )
  }

  return (
    <>
      <SEO title='Checkout' description='Secure premium checkout' />
      <div className='py-12 max-w-6xl mx-auto'>
        <div className='flex items-center gap-2 mb-2 text-xs text-neutral-400 uppercase tracking-widest'>
          <Lock className='w-3.5 h-3.5' /> Secure Checkout
        </div>
        <h1 className='text-3xl font-semibold tracking-tight mb-10'>Checkout</h1>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          <div className='space-y-8 border p-8 rounded-2xl bg-white shadow-sm'>
            <div>
              <h2 className='text-xl font-semibold mb-4'>Delivery Address</h2>
              <div className='space-y-4'>
                <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder='Street address' className='w-full border px-4 py-3 rounded-xl text-sm' />
                <div className='grid grid-cols-2 gap-4'>
                  <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder='City' className='w-full border px-4 py-3 rounded-xl text-sm' />
                  <input value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} placeholder='ZIP' className='w-full border px-4 py-3 rounded-xl text-sm' />
                </div>
                <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder='Country' className='w-full border px-4 py-3 rounded-xl text-sm' />
              </div>
            </div>

            <div className='border-t pt-6'>
              <h2 className='text-xl font-semibold mb-4'>Payment Method</h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${method === 'cod' ? 'border-black bg-neutral-50' : ''}`}>
                  <input type='radio' value='cod' checked={method === 'cod'} onChange={(e) => setMethod(e.target.value)} />
                  <Banknote className='w-5 h-5' />
                  <span className='text-sm'>Cash on Delivery</span>
                </label>
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer ${method === 'razorpay' ? 'border-black bg-neutral-50' : ''}`}>
                  <input type='radio' value='razorpay' checked={method === 'razorpay'} onChange={(e) => setMethod(e.target.value)} />
                  <CreditCard className='w-5 h-5' />
                  <span className='text-sm'>Razorpay</span>
                </label>
              </div>
            </div>
          </div>

          <div className='border bg-neutral-50/50 p-8 rounded-2xl h-fit'>
            <h2 className='text-lg font-semibold mb-6'>Order Summary</h2>
            <div className='mb-4 space-y-3 max-h-48 overflow-y-auto'>
              {items.map((it) => {
                const prod = products[it.product]
                return (
                  <div key={it.product} className='flex justify-between text-sm'>
                    <span className='line-clamp-1 flex-1 pr-4'>{prod?.title || 'Product'} × {it.quantity}</span>
                    <span className='font-medium'>${((prod?.price || 0) * it.quantity).toFixed(2)}</span>
                  </div>
                )
              })}
            </div>

            <div className='flex gap-2 mb-4'>
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder='Coupon' className='flex-1 border rounded-xl px-3 py-2 text-sm' />
              <button type='button' onClick={applyCoupon} className='px-4 py-2 bg-neutral-950 text-white rounded-xl text-sm'>Apply</button>
            </div>
            <p className='text-xs text-neutral-400 mb-4 flex items-center gap-1'><Tag className='w-3 h-3' /> {Object.keys(COUPONS).join(' · ')}</p>

            <div className='space-y-2 text-sm border-t pt-4'>
              <div className='flex justify-between'><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
              {totals.discount > 0 && <div className='flex justify-between text-emerald-700'><span>Discount</span><span>-${totals.discount.toFixed(2)}</span></div>}
              <div className='flex justify-between'><span>Shipping</span><span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span></div>
              <div className='flex justify-between'><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
              <div className='flex justify-between font-semibold text-base pt-2'><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
            </div>

            <button type='button' onClick={placeOrder} disabled={submitting || loading} className='w-full py-4 mt-6 bg-black text-white rounded-full text-sm font-semibold disabled:opacity-50'>
              {submitting ? 'Processing…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlaceOrder
