import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduct, getProducts } from '../api/products'
import { CartContext } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { PageLoader } from '../components/Loading'
import ImageZoom from '../components/ImageZoom'
import ProductCard from '../components/ProductCard'
import SEO from '../components/SEO'
import ScrollReveal from '../components/ScrollReveal'
import { addRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed'
import { getProductImages } from '../utils/productImages'
import SafeImage from '../components/SafeImage'
import { toast } from 'react-toastify'
import { Heart, ShoppingBag, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

const Product = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])
  const [recent, setRecent] = useState([])

  const [quantity, setQuantity] = useState(1)
  const [activeImgIndex, setActiveImgIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' })

  const { addToCart } = useContext(CartContext)
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const res = await getProduct(id)
        setProduct(res.data)
        addRecentlyViewed(id)
        if (res.data.sizes?.length) setSelectedSize(res.data.sizes[0])
        if (res.data.colors?.length) setSelectedColor(res.data.colors[0])

        const relRes = await getProducts({ category: res.data.category, limit: 5 })
        setRelated((relRes.data.products || []).filter((p) => p._id !== id).slice(0, 4))

        const ids = getRecentlyViewed().filter((rid) => rid !== id).slice(0, 4)
        const recentProds = await Promise.all(ids.map((rid) => getProduct(rid).catch(() => null)))
        setRecent(recentProds.map((r) => r?.data).filter(Boolean))
      } catch (err) {
        console.error(err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id])

  if (loading) return <PageLoader />

  if (!product) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center text-center'>
        <p className='text-neutral-600 font-medium'>Product not found</p>
        <button onClick={() => navigate('/collection')} className='mt-4 px-6 py-2 bg-neutral-900 text-white rounded-full text-sm'>
          Go to Collection
        </button>
      </div>
    )
  }

  const isWishlisted = isInWishlist(product._id)
  const images = getProductImages(product)
  const activeImg = images[activeImgIndex] || images[0]
  const displayReviews = product.reviews?.length
    ? product.reviews
    : [
        { name: 'Verified Buyer', rating: 5, comment: 'Outstanding quality and fit.' },
        { name: 'Style Enthusiast', rating: 4, comment: 'Beautiful design, fast shipping.' },
      ]

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity)
      toast.success(`${product.title} added to cart`)
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  const handleBuyNow = async () => {
    try {
      await addToCart(product._id, quantity)
      navigate('/place-order')
    } catch {
      toast.error('Failed to proceed')
    }
  }

  const submitReview = (e) => {
    e.preventDefault()
    toast.success('Thank you! Your review has been recorded.')
    setReviewForm({ name: '', rating: 5, comment: '' })
  }

  return (
    <>
      <SEO title={product.title} description={product.description?.slice(0, 160)} />
      <div className='py-12 animate-fade-in'>
        <button onClick={() => navigate('/collection')} className='flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8'>
          <ArrowLeft className='w-4 h-4' /> Back to Collection
        </button>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20'>
          <div className='space-y-4'>
            <ImageZoom src={activeImg} alt={product.title} />
            {images.length > 1 && (
              <div className='flex gap-3 overflow-x-auto pb-2'>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type='button'
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 ${activeImgIndex === idx ? 'ring-2 ring-neutral-950' : 'ring-1 ring-neutral-200'}`}
                  >
                    <SafeImage src={img} alt={`View ${idx + 1}`} className='w-full h-full object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='flex flex-col justify-between space-y-8'>
            <div className='space-y-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <span className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>{product.category}</span>
                  <h1 className='text-3xl md:text-4xl font-light text-neutral-950 leading-tight mt-1'>{product.title}</h1>
                </div>
                <button type='button' onClick={() => toggleWishlist(product._id)} className={`p-3 rounded-full ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-neutral-100 text-neutral-600'}`}>
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              <p className='text-4xl font-semibold'>${product.price.toFixed(2)}</p>
              {product.ratings && (
                <div className='flex items-center gap-2'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.ratings) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
                  ))}
                  <span className='text-sm text-neutral-600'>{product.ratings.toFixed(1)} ({displayReviews.length} reviews)</span>
                </div>
              )}
              <p className='text-neutral-600 font-light leading-relaxed'>{product.description}</p>
            </div>

            <div className='space-y-6'>
              {product.sizes?.length > 0 && (
                <div className='space-y-3'>
                  <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Size</label>
                  <div className='flex flex-wrap gap-2'>
                    {product.sizes.map((size) => (
                      <button key={size} type='button' onClick={() => setSelectedSize(size)} className={`w-12 h-12 rounded-lg border-2 text-sm font-medium ${selectedSize === size ? 'bg-neutral-950 text-white border-neutral-950' : 'border-neutral-200'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.colors?.length > 0 && (
                <div className='space-y-3'>
                  <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Color</label>
                  <div className='flex flex-wrap gap-2'>
                    {product.colors.map((color) => (
                      <button key={color} type='button' onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg border-2 text-sm ${selectedColor === color ? 'bg-neutral-950 text-white border-neutral-950' : 'border-neutral-200'}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className='space-y-3'>
                <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Quantity</label>
                <div className='flex items-center gap-4 border border-neutral-200 rounded-xl w-fit px-2'>
                  <button type='button' onClick={() => setQuantity(Math.max(1, quantity - 1))} className='p-2'><ChevronLeft className='w-4 h-4' /></button>
                  <span className='w-8 text-center font-medium'>{quantity}</span>
                  <button type='button' onClick={() => setQuantity(quantity + 1)} className='p-2'><ChevronRight className='w-4 h-4' /></button>
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              <button type='button' onClick={handleAddToCart} disabled={product.stock <= 0} className='flex-1 py-4 border-2 border-neutral-950 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50'>
                <ShoppingBag className='w-5 h-5' /> Add to Cart
              </button>
              <button type='button' onClick={handleBuyNow} disabled={product.stock <= 0} className='flex-1 py-4 bg-neutral-950 text-white rounded-xl font-medium disabled:opacity-50'>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <ScrollReveal>
          <div className='space-y-8 mb-20 border-t border-neutral-200 pt-12'>
            <h2 className='text-2xl font-light'>Customer Reviews</h2>
            <div className='space-y-4'>
              {displayReviews.map((review, idx) => (
                <div key={idx} className='p-6 bg-neutral-50 rounded-xl border border-neutral-200/50'>
                  <p className='font-medium'>{review.name}</p>
                  <div className='flex gap-1 my-2'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
                    ))}
                  </div>
                  <p className='text-sm text-neutral-600 font-light'>{review.comment}</p>
                </div>
              ))}
            </div>
            <form onSubmit={submitReview} className='p-6 border border-neutral-200 rounded-2xl space-y-4 max-w-lg'>
              <h3 className='font-medium'>Write a review</h3>
              <input value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder='Your name' className='w-full border rounded-lg px-4 py-2 text-sm' required />
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className='w-full border rounded-lg px-4 py-2 text-sm'>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder='Your review' className='w-full border rounded-lg px-4 py-2 text-sm' rows={3} required />
              <button type='submit' className='px-6 py-2 bg-neutral-950 text-white rounded-full text-sm'>Submit Review</button>
            </form>
          </div>
        </ScrollReveal>

        {related.length > 0 && (
          <ScrollReveal>
            <section className='space-y-8 pt-12 border-t border-neutral-200 mb-16'>
              <h2 className='text-2xl font-light'>Related Products</h2>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
                {related.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          </ScrollReveal>
        )}

        {recent.length > 0 && (
          <ScrollReveal>
            <section className='space-y-8 pt-12 border-t border-neutral-200'>
              <h2 className='text-2xl font-light'>Recently Viewed</h2>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-6'>
                {recent.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    </>
  )
}

export default Product
