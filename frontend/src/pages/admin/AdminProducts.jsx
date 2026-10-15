import React, { useState, useEffect, useCallback } from 'react'
import api from '../../api/axios'
import { getProducts } from '../../api/products'
import SEO from '../../components/SEO'
import { toast } from 'react-toastify'
import { Upload, X, Image as ImageIcon, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getProductImage } from '../../utils/productImages'
import SafeImage from '../../components/SafeImage'
import { usePagination } from '../../hooks/usePagination'
import { exportToCsv } from '../../utils/exportCsv'

const PER_PAGE = 8

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    category: 'Men',
    stock: '',
    sizes: 'S,M,L,XL',
    colors: 'Black,White',
  })
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [editing, setEditing] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const filtered = products.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const { page, setPage, totalPages, paginated } = usePagination(filtered, PER_PAGE)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts({ limit: 100 })
      setProducts(res.data.products || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search, setPage])

  const onFiles = useCallback((fileList) => {
    const arr = Array.from(fileList).slice(0, 6)
    setFiles(arr)
    setPreviews((prev) => {
      prev.forEach((u) => { if (u.startsWith('blob:')) URL.revokeObjectURL(u) })
      return arr.map((f) => URL.createObjectURL(f))
    })
  }, [])

  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const toggleAll = () => {
    if (selected.length === paginated.length) setSelected([])
    else setSelected(paginated.map((p) => p._id))
  }

  const handleBulkDelete = async () => {
    if (!selected.length) return toast.warning('Select products first')
    if (!confirm(`Delete ${selected.length} products?`)) return
    const token = localStorage.getItem('token')
    for (const id of selected) {
      try {
        await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      } catch { /* continue */ }
    }
    setProducts(products.filter((p) => !selected.includes(p._id)))
    setSelected([])
    toast.success('Bulk delete completed')
  }

  const exportCsv = () => {
    exportToCsv(
      'products-export.csv',
      filtered.map((p) => ({
        id: p._id,
        title: p.title,
        price: p.price,
        category: p.category,
        stock: p.stock,
      })),
      ['id', 'title', 'price', 'category', 'stock']
    )
    toast.success('CSV exported')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      let imageUrls = []
      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((f) => formData.append('images', f))
        try {
          const upRes = await api.post('/upload', formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          })
          imageUrls = upRes.data.urls || []
        } catch {
          imageUrls = previews
        }
      }
      const payload = {
        ...form,
        images: imageUrls.length ? imageUrls : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
        price: Number(form.price),
        stock: Number(form.stock),
        sizes: form.sizes.split(',').map((s) => s.trim()),
        colors: form.colors.split(',').map((c) => c.trim()),
      }
      if (editing) {
        await api.put(`/products/${editing}`, payload, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Product updated')
      } else {
        await api.post('/products', payload, { headers: { Authorization: `Bearer ${token}` } })
        toast.success('Product created')
      }
      setForm({ title: '', price: '', description: '', category: 'Men', stock: '', sizes: 'S,M,L,XL', colors: 'Black,White' })
      setFiles([])
      setPreviews([])
      setEditing(null)
      fetchProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setProducts(products.filter((p) => p._id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <>
      <SEO title='Admin Products' noindex />
      <div className='py-8 sm:py-12 max-w-5xl mx-auto'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
          <h1 className='text-2xl sm:text-3xl font-light'>Manage Products</h1>
          <div className='flex flex-wrap gap-2'>
            <button type='button' onClick={exportCsv} className='px-4 py-2 border rounded-full text-sm flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800'>
              <Download className='w-4 h-4' /> Export CSV
            </button>
            {selected.length > 0 && (
              <button type='button' onClick={handleBulkDelete} className='px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm flex items-center gap-2'>
                <Trash2 className='w-4 h-4' /> Delete ({selected.length})
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleAdd} className='card p-6 sm:p-8 mb-8 space-y-4'>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder='Title' className='input text-sm' required />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder='Price' type='number' className='input text-sm' required />
            <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder='Stock' type='number' className='input text-sm' />
          </div>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className='input text-sm'>
            <option>Men</option><option>Women</option><option>Kids</option>
          </select>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder='Description' className='input text-sm' rows={3} />
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files) }} className={`border-2 border-dashed rounded-2xl p-6 text-center ${dragOver ? 'border-neutral-900' : ''}`}>
            <Upload className='w-6 h-6 mx-auto mb-2 text-neutral-400' />
            <input type='file' multiple accept='image/*' onChange={(e) => onFiles(e.target.files)} className='text-sm' />
          </div>
          {previews.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {previews.map((src, i) => (
                <img key={i} src={src} alt='' className='w-16 h-16 rounded-lg object-cover border' />
              ))}
            </div>
          )}
          <button type='submit' className='btn-primary rounded-full text-sm'>{editing ? 'Update' : 'Add'} Product</button>
        </form>

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search products…' className='input text-sm mb-4 max-w-md' />

        {loading ? (
          <div className='space-y-3'>{[1, 2, 3].map((n) => <div key={n} className='h-20 skeleton' />)}</div>
        ) : (
          <>
            <label className='flex items-center gap-2 text-sm text-neutral-500 mb-3 cursor-pointer'>
              <input type='checkbox' checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} />
              Select page ({paginated.length})
            </label>
            <div className='space-y-3'>
              {paginated.map((p) => (
                <div key={p._id} className='flex gap-3 items-center card p-4'>
                  <input type='checkbox' checked={selected.includes(p._id)} onChange={() => toggleSelect(p._id)} />
                  <div className='w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0'>
                    <SafeImage src={getProductImage(p)} alt='' className='w-full h-full object-cover' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium truncate'>{p.title}</p>
                    <p className='text-sm text-neutral-500'>${p.price} · {p.stock} stock</p>
                  </div>
                  <div className='flex gap-2 shrink-0'>
                    <button type='button' onClick={() => { setEditing(p._id); setForm({ title: p.title, price: p.price, description: p.description, category: p.category, stock: p.stock, sizes: (p.sizes || []).join(','), colors: (p.colors || []).join(',') }) }} className='text-xs px-3 py-1.5 border rounded-full'>Edit</button>
                    <button type='button' onClick={() => handleDelete(p._id)} className='text-xs px-3 py-1.5 text-red-600 rounded-full'>Del</button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className='flex justify-center items-center gap-2 mt-6'>
                <button type='button' disabled={page === 1} onClick={() => setPage(page - 1)} className='p-2 border rounded-full disabled:opacity-30'><ChevronLeft className='w-4 h-4' /></button>
                <span className='text-sm'>{page} / {totalPages}</span>
                <button type='button' disabled={page === totalPages} onClick={() => setPage(page + 1)} className='p-2 border rounded-full disabled:opacity-30'><ChevronRight className='w-4 h-4' /></button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default AdminProducts
