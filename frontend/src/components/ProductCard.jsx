import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { getProductImage } from '../utils/productImages'
import SafeImage from './SafeImage'
import QuickViewModal from './QuickViewModal'

const ProductCard = ({ product, showWishlist = true }) => {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [quickView, setQuickView] = useState(false)
  const wishlisted = isInWishlist(product._id)
  const imageSrc = getProductImage(product)

  return (
    <>
      <div className='group block space-y-4 relative'>
        <Link to={`/product/${product._id}`} className='block'>
          <div className='relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md group-hover:shadow-premium'>
            <SafeImage
              src={imageSrc}
              alt={product.title}
              className='w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100'
              width={400}
              height={533}
            />
            {product.stock <= 0 && (
              <div className='absolute inset-0 bg-neutral-900/60 flex items-center justify-center z-10'>
                <span className='px-4 py-1.5 bg-white text-neutral-900 text-xs font-semibold uppercase rounded-full'>Out of Stock</span>
              </div>
            )}
            <div className='absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block'>
              <button
                type='button'
                onClick={(e) => { e.preventDefault(); setQuickView(true) }}
                className='w-full py-2.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur text-sm font-medium rounded-full flex items-center justify-center gap-2 shadow-sm hover:bg-white transition-colors'
              >
                <Eye className='w-4 h-4' /> Quick View
              </button>
            </div>
          </div>
        </Link>
        {showWishlist && (
          <button
            type='button'
            onClick={() => toggleWishlist(product._id)}
            className='absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center shadow hover:scale-105 transition-transform'
            aria-label='Toggle wishlist'
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-700 dark:text-neutral-300'}`} />
          </button>
        )}
        <div className='space-y-1 px-1'>
          <span className='text-xs text-neutral-400 uppercase tracking-wider font-medium'>{product.category}</span>
          <Link to={`/product/${product._id}`}>
            <h3 className='text-sm font-medium text-neutral-800 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white line-clamp-1 transition-colors'>
              {product.title}
            </h3>
          </Link>
          <p className='text-base font-semibold text-neutral-950 dark:text-white'>${product.price.toFixed(2)}</p>
        </div>
      </div>
      {quickView && <QuickViewModal productId={product._id} onClose={() => setQuickView(false)} />}
    </>
  )
}

export default ProductCard
