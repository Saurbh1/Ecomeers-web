import React, { useState, useEffect } from 'react'
import { getUserOrders } from '../api/orders'
import SEO from '../components/SEO'
import { Calendar, Package, CreditCard, ChevronRight, Truck, CheckCircle2, AlertCircle } from 'lucide-react'
import { getProductImage, enrichProduct } from '../utils/productImages'
import { mockProducts } from '../data/mockProducts'
import SafeImage from '../components/SafeImage'

const resolveOrderProduct = (it) => {
  if (it.product && typeof it.product === 'object' && it.product.title) {
    return enrichProduct(it.product)
  }
  const id = it.product?._id || it.product
  return enrichProduct(mockProducts.find((p) => p._id === id) || { _id: id, title: 'Product' })
}
import { Link } from 'react-router-dom'

const Order = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const data = await getUserOrders(token)
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center'>
        <div className='w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin'></div>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
    <SEO title='My Orders' />
    <div className='max-w-4xl mx-auto pb-20 animate-fade-in'>
      {/* Header */}
      <div className='mb-10 space-y-2'>
        <span className='text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase'>Account Management</span>
        <h1 className='text-3xl font-light tracking-tight text-neutral-900'>My Purchase History</h1>
      </div>

      {orders.length === 0 ? (
        <div className='text-center py-20 bg-neutral-50/50 rounded-3xl border border-dashed border-neutral-200/80'>
          <Package className='w-12 h-12 text-neutral-300 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-neutral-900 mb-1'>No orders found</h3>
          <p className='text-neutral-500 text-sm font-light mb-6'>You haven't placed any orders on our platform yet.</p>
          <Link to='/collection' className='inline-flex items-center gap-2 bg-neutral-950 text-white px-6 py-3 rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors shadow'>
            Start Shopping
            <ChevronRight className='w-4 h-4' />
          </Link>
        </div>
      ) : (
        <div className='space-y-8'>
          {orders.map(o => (
            <div key={o._id} className='bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300'>
              {/* Top Banner (Order metadata) */}
              <div className='bg-neutral-50/60 border-b border-neutral-100 p-6 flex flex-col sm:flex-row justify-between gap-4 text-sm font-light text-neutral-600'>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2'>
                  <div>
                    <span className='block text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1'>Order Number</span>
                    <span className='font-mono font-medium text-neutral-950'>#{o._id.substring(0, 10).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className='block text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1'>Date Placed</span>
                    <span className='font-medium text-neutral-950 flex items-center gap-1.5'><Calendar className='w-3.5 h-3.5 text-neutral-400' /> {formatDate(o.createdAt)}</span>
                  </div>
                  <div>
                    <span className='block text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1'>Total Cost</span>
                    <span className='font-semibold text-neutral-950'>${o.amount.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className='block text-xs text-neutral-400 uppercase tracking-wider font-medium mb-1'>Payment Method</span>
                    <span className='font-medium text-neutral-950 flex items-center gap-1.5 capitalize'><CreditCard className='w-3.5 h-3.5 text-neutral-400' /> {o.paymentMethod}</span>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize ${getStatusColor(o.orderStatus)}`}>
                    {o.orderStatus}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border capitalize ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    Payment: {o.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className='divide-y divide-neutral-100 p-6'>
                {o.items?.map((it, idx) => (
                  <div key={idx} className='py-5 first:pt-0 last:pb-0 flex gap-4 items-start'>
                    <Link to={`/product/${it.product?._id || it.product}`} className='w-20 h-24 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-100 shadow-sm'>
                      <SafeImage src={getProductImage(resolveOrderProduct(it))} className='w-full h-full object-cover' alt={resolveOrderProduct(it).title} />
                    </Link>
                    <div className='flex-1 space-y-1.5'>
                      <div className='flex justify-between items-baseline gap-2'>
                        <Link to={`/product/${it.product?._id || it.product}`} className='text-sm font-medium text-neutral-800 hover:text-black line-clamp-1 transition-colors'>
                          {it.product?.title || 'Curated Design Piece'}
                        </Link>
                        <span className='text-sm font-semibold text-neutral-950'>${((it.price || it.product?.price || 0) * it.quantity).toFixed(2)}</span>
                      </div>
                      <p className='text-xs text-neutral-400 uppercase tracking-wider font-medium'>{it.product?.category}</p>
                      <div className='flex justify-between items-center text-xs text-neutral-500 font-light'>
                        <span>Quantity: <strong className='font-semibold text-neutral-800'>{it.quantity}</strong></span>
                        <span>Unit Price: ${ (it.price || it.product?.price || 0).toFixed(2) }</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Summary & Status Timeline */}
              <div className='bg-neutral-50/30 border-t border-neutral-100 p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2.5'>Shipping Address</h4>
                  <div className='text-sm font-light text-neutral-600 space-y-0.5'>
                    <p className='font-medium text-neutral-900'>{o.address?.firstName} {o.address?.lastName}</p>
                    <p>{o.address?.street}</p>
                    <p>{o.address?.city}, {o.address?.state} {o.address?.zipCode}</p>
                    <p>{o.address?.country}</p>
                    <p className='text-xs text-neutral-400 mt-1'>Phone: {o.address?.phone}</p>
                  </div>
                </div>

                <div className='flex flex-col justify-center'>
                  <h4 className='text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3.5'>Order Progress</h4>
                  <div className='flex items-center gap-2'>
                    {/* Visual Status Steps */}
                    {[
                      { name: 'pending', label: 'Processing', icon: Package, done: true },
                      { name: 'shipped', label: 'Shipped', icon: Truck, done: o.orderStatus === 'shipped' || o.orderStatus === 'delivered' },
                      { name: 'delivered', label: 'Delivered', icon: CheckCircle2, done: o.orderStatus === 'delivered' }
                    ].map((step, idx, arr) => {
                      const IconComp = step.icon
                      const active = step.done && o.orderStatus !== 'cancelled'
                      return (
                        <React.Fragment key={step.name}>
                          <div className='flex items-center gap-2'>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${active ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm' : 'bg-white border-neutral-200 text-neutral-400'}`}>
                              <IconComp className='w-4.5 h-4.5' />
                            </div>
                            <span className={`text-xs font-medium hidden sm:inline ${active ? 'text-neutral-900 font-semibold' : 'text-neutral-400'}`}>{step.label}</span>
                          </div>
                          {idx < arr.length - 1 && (
                            <div className={`h-[2px] flex-1 min-w-[20px] transition-colors ${active && arr[idx+1].done ? 'bg-neutral-900' : 'bg-neutral-200'}`}></div>
                          )}
                        </React.Fragment>
                      )
                    })}
                    
                    {o.orderStatus === 'cancelled' && (
                      <div className='flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-full'>
                        <AlertCircle className='w-4 h-4' />
                        <span className='text-xs font-semibold uppercase tracking-wider'>Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default Order
