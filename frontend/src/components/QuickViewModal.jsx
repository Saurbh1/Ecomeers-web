import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Heart } from 'lucide-react'
import { getProduct } from '../api/products'
import { useWishlist } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'
import { toast } from 'react-toastify'
import { getProductImage } from '../utils/productImages'
import SafeImage from './SafeImage'

const QuickViewModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useContext(CartContext)
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    if (!productId) return
    const load = async () => {
      setLoading(true)
      try {
        const res = await getProduct(productId)
        setProduct(res.data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!productId) return null

  const handleAdd = async () => {
    if (!product) return
    await addToCart(product._id, 1)
    toast.success('Added to cart')
    onClose()
  }

  return (
    <div className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4' role='dialog' aria-modal='true'>
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />
      <div className='relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up safe-bottom'>
        <button type='button' onClick={onClose} className='absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800'>
          <X className='w-5 h-5' />
        </button>

        {loading ? (
          <div className='p-12 flex justify-center'>
            <div className='w-8 h-8 border-2 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin' />
          </div>
        ) : product ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-0'>
            <div className='aspect-[3/4] bg-neutral-100 dark:bg-neutral-800'>
              <SafeImage src={getProductImage(product)} alt={product.title} className='w-full h-full object-cover' />
            </div>
            <div className='p-6 sm:p-8 flex flex-col justify-center space-y-4'>
              <span className='text-xs uppercase tracking-widest text-neutral-400'>{product.category}</span>
              <h2 className='text-2xl font-light text-neutral-950 dark:text-white'>{product.title}</h2>
              <p className='text-2xl font-semibold'>${product.price?.toFixed(2)}</p>
              <p className='text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3'>{product.description}</p>
              <div className='flex gap-3 pt-2'>
                <button type='button' onClick={handleAdd} className='flex-1 py-3 bg-neutral-950 dark:bg-white dark:text-neutral-950 text-white rounded-full text-sm font-medium flex items-center justify-center gap-2'>
                  <ShoppingBag className='w-4 h-4' /> Add to Cart
                </button>
                <button type='button' onClick={() => toggleWishlist(product._id)} className='p-3 border rounded-full dark:border-neutral-700'>
                  <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
              <Link to={`/product/${product._id}`} onClick={onClose} className='text-sm text-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline-offset-4 hover:underline'>
                View full details
              </Link>
            </div>
          </div>
        ) : (
          <p className='p-8 text-center text-neutral-500'>Product unavailable</p>
        )}
      </div>
    </div>
  )
}

export default QuickViewModal
