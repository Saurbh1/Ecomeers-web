import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { mockProducts } from '../data/mockProducts'

const names = ['Sarah', 'James', 'Emma', 'Michael', 'Olivia', 'David', 'Sophia', 'Daniel', 'Ava', 'Lucas']
const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Toronto', 'Berlin', 'Dubai']

const LivePurchaseToast = () => {
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    const show = () => {
      const product = mockProducts[Math.floor(Math.random() * mockProducts.length)]
      const name = names[Math.floor(Math.random() * names.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      setNotice({ name, city, product: product.title })
      setTimeout(() => setNotice(null), 4500)
    }

    const initial = setTimeout(show, 8000)
    const interval = setInterval(show, 22000 + Math.random() * 10000)
    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className='fixed bottom-4 left-4 z-[90] pointer-events-none max-w-[calc(100vw-2rem)] sm:max-w-sm safe-bottom'>
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, x: -24, y: 12 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.35 }}
            className='flex items-start gap-3 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200/80 dark:border-neutral-700 shadow-premium backdrop-blur-md pointer-events-auto'
          >
            <div className='w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0'>
              <ShoppingBag className='w-5 h-5 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div className='min-w-0'>
              <p className='text-xs text-neutral-400'>Just purchased</p>
              <p className='text-sm font-medium text-neutral-900 dark:text-white truncate'>
                {notice.name} from {notice.city}
              </p>
              <p className='text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1'>{notice.product}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LivePurchaseToast
