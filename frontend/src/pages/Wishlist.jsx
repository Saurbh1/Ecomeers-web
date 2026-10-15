import React, { useContext } from 'react'
import { useWishlist } from '../context/WishlistContext'
import { CartContext } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getProductImage } from '../utils/productImages'
import SafeImage from '../components/SafeImage'

const Wishlist = () => {
  const { wishlist, toggleWishlist, getWishlistProducts } = useWishlist()
  const { addToCart } = useContext(CartContext)
  const products = getWishlistProducts()

  const moveToCart = async (product) => {
    try {
      await addToCart(product._id, 1)
      await toggleWishlist(product._id)
      toast.success(`${product.title} moved to cart!`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to move item to cart')
    }
  }

  if (wishlist.length === 0) {
    return (
      <div className='text-center py-24 max-w-md mx-auto'>
        <h1 className='text-3xl font-semibold mb-3 tracking-tight'>Your Wishlist is Empty</h1>
        <p className='text-neutral-500 mb-8 text-sm'>Save items you love and shop them later.</p>
        <Link to='/collection' className='inline-block px-8 py-3.5 bg-black text-white text-sm font-medium rounded-full'>
          Browse Collection
        </Link>
      </div>
    )
  }

  return (
    <div className='py-12 max-w-6xl mx-auto'>
      <div className='flex justify-between items-baseline mb-8'>
        <h1 className='text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white'>My Wishlist</h1>
        <p className='text-sm text-neutral-500'>{products.length} items</p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8'>
        {products.map((prod) => (
          <div
            key={prod._id}
            className='group relative flex flex-col border border-neutral-100 dark:border-neutral-800 p-4 rounded-xl bg-white dark:bg-neutral-900 hover:shadow-md transition-all duration-300'
          >
            <button
              type='button'
              onClick={() => toggleWishlist(prod._id)}
              className='absolute top-6 right-6 z-10 w-8 h-8 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-full flex items-center justify-center text-red-500'
              aria-label='Remove from wishlist'
            >
              ♥
            </button>

            <Link to={`/product/${prod._id}`} className='overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-800 aspect-square'>
              <SafeImage
                src={getProductImage(prod)}
                alt={prod.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
              />
            </Link>

            <div className='flex flex-col flex-1 mt-4 justify-between'>
              <div>
                <Link to={`/product/${prod._id}`} className='block font-medium text-neutral-800 dark:text-neutral-100 text-sm md:text-base line-clamp-1'>
                  {prod.title}
                </Link>
                <p className='text-xs text-neutral-400 capitalize mt-1'>{prod.category}</p>
                <p className='font-semibold text-neutral-900 dark:text-white mt-2 text-base'>${prod.price?.toFixed(2)}</p>
              </div>
              <div className='mt-5 space-y-2'>
                <button type='button' onClick={() => moveToCart(prod)} className='w-full py-2.5 bg-black text-white rounded-full text-xs font-semibold'>
                  Move to Cart
                </button>
                <Link to={`/product/${prod._id}`} className='block w-full py-2 text-center text-xs font-medium text-neutral-600 border border-neutral-200 dark:border-neutral-700 rounded-full'>
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
