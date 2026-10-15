import React, { useState, useEffect } from 'react'
import api from '../../api/axios'
import SEO from '../../components/SEO'
import { toast } from 'react-toastify'
import { Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { getLocalOrders } from '../../utils/localOrders'
import { usePagination } from '../../hooks/usePagination'
import { exportToCsv } from '../../utils/exportCsv'

const PER_PAGE = 10

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState([])

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const res = await api.get('/orders/admin', { headers: { Authorization: `Bearer ${token}` } })
        setOrders(res.data?.length ? res.data : getLocalOrders())
      } catch {
        setOrders(getLocalOrders())
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = orders.filter((o) => statusFilter === 'all' || o.orderStatus === statusFilter)
  const { page, setPage, totalPages, paginated } = usePagination(filtered, PER_PAGE)

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token')
      await api.put(`/orders/${id}`, { orderStatus: status }, { headers: { Authorization: `Bearer ${token}` } })
      setOrders(orders.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)))
      toast.success('Status updated')
    } catch {
      setOrders(orders.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)))
      toast.info('Updated locally')
    }
  }

  const bulkStatus = async (status) => {
    if (!selected.length) return toast.warning('Select orders first')
    for (const id of selected) await updateStatus(id, status)
    setSelected([])
  }

  const exportCsv = () => {
    exportToCsv(
      'orders-export.csv',
      filtered.map((o) => ({
        id: o._id,
        amount: o.amount,
        status: o.orderStatus,
        payment: o.paymentStatus,
        method: o.paymentMethod,
      })),
      ['id', 'amount', 'status', 'payment', 'method']
    )
    toast.success('Orders exported')
  }

  return (
    <>
      <SEO title='Admin Orders' noindex />
      <div className='py-8 sm:py-12 max-w-4xl mx-auto'>
        <div className='flex flex-col sm:flex-row justify-between gap-4 mb-8'>
          <h1 className='text-2xl sm:text-3xl font-light'>Manage Orders</h1>
          <button type='button' onClick={exportCsv} className='px-4 py-2 border rounded-full text-sm flex items-center gap-2 w-fit'>
            <Download className='w-4 h-4' /> Export CSV
          </button>
        </div>

        <div className='flex flex-wrap gap-3 mb-6'>
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-4 py-2 rounded-full text-xs font-medium capitalize ${statusFilter === s ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'border'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className='flex gap-2 mb-4'>
            <button type='button' onClick={() => bulkStatus('shipped')} className='text-xs px-3 py-1.5 border rounded-full'>Mark Shipped</button>
            <button type='button' onClick={() => bulkStatus('delivered')} className='text-xs px-3 py-1.5 border rounded-full'>Mark Delivered</button>
          </div>
        )}

        {loading ? (
          <div className='space-y-3'>{[1, 2, 3].map((n) => <div key={n} className='h-24 skeleton' />)}</div>
        ) : filtered.length === 0 ? (
          <p className='text-neutral-500 text-sm'>No orders match this filter.</p>
        ) : (
          <>
            <div className='space-y-4'>
              {paginated.map((o) => (
                <div key={o._id} className='card p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between'>
                  <div className='flex gap-3 items-start'>
                    <input type='checkbox' checked={selected.includes(o._id)} onChange={() => setSelected((s) => s.includes(o._id) ? s.filter((x) => x !== o._id) : [...s, o._id])} className='mt-1' />
                    <div>
                      <p className='font-mono text-sm'>#{String(o._id).slice(0, 12)}</p>
                      <p className='text-sm text-neutral-500 mt-1'>${o.amount?.toFixed(2)} · {o.paymentMethod}</p>
                    </div>
                  </div>
                  <select value={o.orderStatus || 'pending'} onChange={(e) => updateStatus(o._id, e.target.value)} className='input text-sm max-w-[180px]'>
                    <option value='pending'>Pending</option>
                    <option value='shipped'>Shipped</option>
                    <option value='delivered'>Delivered</option>
                    <option value='cancelled'>Cancelled</option>
                  </select>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className='flex justify-center gap-2 mt-8'>
                <button type='button' disabled={page === 1} onClick={() => setPage(page - 1)} className='p-2 border rounded-full'><ChevronLeft className='w-4 h-4' /></button>
                <span className='text-sm py-2'>{page}/{totalPages}</span>
                <button type='button' disabled={page === totalPages} onClick={() => setPage(page + 1)} className='p-2 border rounded-full'><ChevronRight className='w-4 h-4' /></button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default AdminOrders
