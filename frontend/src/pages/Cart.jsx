import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../context/CartContext'
import { getProduct } from '../api/products'
import { useNavigate, Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getProductImage, enrichProduct } from '../utils/productImages'
import SafeImage from '../components/SafeImage'
import { calculateOrderTotals, validateCoupon, COUPONS } from '../utils/checkout'
import { Tag, Truck } from 'lucide-react'
import { toast } from 'react-toastify'

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useContext(CartContext)
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      const prods = { ...products }
      for (const item of items) {
        if (!prods[item.product]) {
          try {
            const res = await getProduct(item.product)
            prods[item.product] = res.data
          } catch {
            /* skip */
          }
        }
      }
      setProducts(prods)
      setLoading(false)
    }
    if (items.length > 0) fetchProductDetails()
    else setLoading(false)
  }, [items])

  const subtotal = items.reduce((s, it) => {
    const prod = products[it.product]
    return s + (prod?.price || 0) * it.quantity
  }, 0)

  const totals = calculateOrderTotals(subtotal, appliedCoupon)

  const applyCoupon = () => {
    const { valid, coupon, message } = validateCoupon(couponInput, subtotal)
    if (!valid) {
      toast.error(message)
      return
    }
    setAppliedCoupon(coupon.code)
    toast.success(`Coupon ${coupon.code} applied`)
  }

  if (loading && items.length > 0) {
    return (
      <div className='py-16 max-w-5xl mx-auto'>
        <div className='h-8 w-40 bg-neutral-200 animate-pulse rounded mb-8' />
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          <div className='lg:col-span-2 space-y-6'>
            {[1, 2].map((n) => (
              <div key={n} className='flex gap-6 border p-5 rounded-xl animate-pulse'>
                <div className='w-24 h-24 bg-neutral-200 rounded' />
                <div className='flex-1 h-16 bg-neutral-200 rounded' />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <SEO title='Cart' />
        <div className='text-center py-24 max-w-md mx-auto'>
          <h1 className='text-3xl font-semibold mb-3 tracking-tight'>Your Cart is Empty</h1>
          <p className='text-neutral-500 mb-8 text-sm'>Browse our collections to find your perfect pieces.</p>
          <Link to='/collection' className='inline-block px-8 py-3.5 bg-black text-white text-sm font-medium rounded-full hover:bg-neutral-800'>
            Continue Shopping
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO title='Shopping Cart' />
      <div className='py-12 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-semibold tracking-tight mb-8'>Shopping Cart</h1>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 items-start'>
          <div className='lg:col-span-2 space-y-6'>
            {items.map((it) => {
              const prod = products[it.product]
              return (
                <div key={it.product} className='flex gap-6 border border-neutral-100 p-5 rounded-xl bg-white hover:shadow-sm transition-all'>
                  <SafeImage src={getProductImage(enrichProduct(prod || {}))} className='w-24 h-28 object-cover rounded-lg bg-neutral-50 shrink-0' alt={prod?.title || 'Product'} />
                  <div className='flex flex-col flex-1 justify-between'>
                    <div>
                      <p className='font-medium text-lg line-clamp-1'>{prod?.title || 'Product'}</p>
                      <p className='text-sm text-neutral-400 capitalize'>{prod?.category}</p>
                      <p className='font-semibold mt-1'>${((prod?.price || 0) * it.quantity).toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between items-center mt-4'>
                      <div className='flex items-center border rounded-full px-3 py-1 bg-neutral-50'>
                        <button type='button' onClick={() => updateQuantity(it.product, it.quantity - 1)} className='px-2'>−</button>
                        <span className='w-8 text-center text-sm font-semibold'>{it.quantity}</span>
                        <button type='button' onClick={() => updateQuantity(it.product, it.quantity + 1)} className='px-2'>+</button>
                      </div>
                      <button type='button' onClick={() => removeFromCart(it.product)} className='text-sm text-neutral-400 hover:text-red-600'>Remove</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className='border bg-neutral-50/50 p-8 rounded-2xl h-fit shadow-sm space-y-6'>
            <h2 className='text-lg font-semibold'>Order Summary</h2>

            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Tag className='absolute left-3 top-3 w-4 h-4 text-neutral-400' />
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder='Coupon code'
                  className='w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-white'
                />
              </div>
              <button type='button' onClick={applyCoupon} className='px-4 py-2 bg-neutral-950 text-white rounded-xl text-sm font-medium'>Apply</button>
            </div>
            <p className='text-xs text-neutral-400'>Try: {Object.keys(COUPONS).join(', ')}</p>
            {appliedCoupon && <p className='text-xs text-emerald-600 font-medium'>Applied: {appliedCoupon}</p>}

            <div className='space-y-3 text-sm text-neutral-600'>
              <div className='flex justify-between'><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
              {totals.discount > 0 && <div className='flex justify-between text-emerald-700'><span>Discount</span><span>-${totals.discount.toFixed(2)}</span></div>}
              <div className='flex justify-between items-center'>
                <span className='flex items-center gap-1'><Truck className='w-4 h-4' /> Shipping</span>
                <span>{totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`}</span>
              </div>
              <div className='flex justify-between border-b pb-3'><span>Tax (10%)</span><span>${totals.tax.toFixed(2)}</span></div>
              <div className='flex justify-between text-base font-semibold text-neutral-900'><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
            </div>

            <button type='button' onClick={() => navigate('/place-order', { state: { coupon: appliedCoupon } })} className='w-full py-4 bg-black text-white rounded-full text-sm font-semibold hover:bg-neutral-800'>
              Proceed to Checkout
            </button>
            <Link to='/collection' className='block text-center text-sm text-neutral-500 hover:text-black'>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
