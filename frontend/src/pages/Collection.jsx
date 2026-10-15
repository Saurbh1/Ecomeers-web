import React, { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import { Link, useSearchParams } from 'react-router-dom'
import { LoadingGrid } from '../components/Loading'
import ProductCard from '../components/ProductCard'
import ScrollReveal from '../components/ScrollReveal'
import SEO from '../components/SEO'
import { Filter, SlidersHorizontal, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const Collection = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters State synced with URL parameters
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt')
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  // Sync state when URL params change (e.g. Navigating from home categories)
  useEffect(() => {
    setCategory(searchParams.get('category') || '')
    setSearchQuery(searchParams.get('q') || '')
    setPage(1)
  }, [searchParams])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const params = {
          page,
          limit: 12,
          sort
        }
        if (category) params.category = category
        if (searchQuery) params.q = searchQuery

        const res = await getProducts(params)
        setProducts(res.data.products)
        setTotal(res.data.total)
      } catch (err) {
        console.error(err)
        setProducts([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, category, searchQuery, sort])

  const handleCategoryChange = (catName) => {
    const nextCat = category === catName ? '' : catName
    setCategory(nextCat)
    setPage(1)
    
    // Update URL Search Params
    const nextParams = new URLSearchParams(searchParams)
    if (nextCat) {
      nextParams.set('category', nextCat)
    } else {
      nextParams.delete('category')
    }
    setSearchParams(nextParams)
  }

  const handleSearchChange = (e) => {
    const q = e.target.value
    setSearchQuery(q)
    setPage(1)

    const nextParams = new URLSearchParams(searchParams)
    if (q) {
      nextParams.set('q', q)
    } else {
      nextParams.delete('q')
    }
    setSearchParams(nextParams)
  }

  const totalPages = Math.ceil(total / 12) || 1

  return (
    <>
    <SEO title='Collection' description='Browse and filter our premium fashion catalog.' />
    <div className='pb-20 animate-fade-in'>
      {/* Top Banner & Header */}
      <div className='mb-10 space-y-4'>
        <span className='text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase'>Curated Collection</span>
        <h1 className='text-3xl md:text-5xl font-light tracking-tight text-neutral-950'>Explore Catalog</h1>
      </div>

      <div className='flex flex-col lg:flex-row gap-10 items-start'>
        
        {/* FILTERS SIDEBAR (DESKTOP) */}
        <aside className='w-full lg:w-[260px] shrink-0 space-y-8 hidden lg:block'>
          {/* Search Box */}
          <div className='space-y-3'>
            <h3 className='text-sm font-semibold tracking-wider uppercase text-neutral-950 flex items-center gap-2'>
              <Search className='w-4 h-4' /> Search
            </h3>
            <div className='relative'>
              <input 
                type='text' 
                placeholder='Search products...' 
                value={searchQuery}
                onChange={handleSearchChange}
                className='w-full pl-4 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
              />
              <Search className='absolute right-3.5 top-3.5 w-4 h-4 text-neutral-400 pointer-events-none' />
            </div>
          </div>

          <hr className='border-neutral-200/60' />

          {/* Categories */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold tracking-wider uppercase text-neutral-950 flex items-center gap-2'>
              <Filter className='w-4 h-4' /> Category
            </h3>
            <div className='space-y-2.5'>
              {['Men', 'Women', 'Kids'].map((cat) => (
                <label key={cat} className='flex items-center gap-3 cursor-pointer group text-sm text-neutral-600 hover:text-neutral-950 select-none'>
                  <input 
                    type='checkbox' 
                    checked={category === cat}
                    onChange={() => handleCategoryChange(cat)}
                    className='w-4 h-4 border-neutral-300 rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer accent-neutral-950'
                  />
                  <span className={`${category === cat ? 'font-medium text-neutral-950' : ''} transition-colors`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* MOBILE FILTERS TOGGLE & CONTROLS */}
        <div className='w-full lg:hidden flex gap-4 items-center mb-6'>
          <button 
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className='flex-1 py-3 px-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-neutral-50 active:bg-neutral-100 transition-all shadow-sm'
          >
            <SlidersHorizontal className='w-4 h-4' />
            {showFiltersMobile ? 'Hide Filters' : 'Filters'}
          </button>
          
          <select 
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className='flex-1 py-3 px-4 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none shadow-sm'
          >
            <option value='-createdAt'>Newest First</option>
            <option value='price'>Price: Low to High</option>
            <option value='-price'>Price: High to Low</option>
          </select>
        </div>

        {/* MOBILE FILTERS DRAWER */}
        {showFiltersMobile && (
          <div className='w-full lg:hidden bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 mb-6 space-y-6 animate-fade-in'>
            <div className='space-y-2.5'>
              <h3 className='text-xs font-semibold text-neutral-400 uppercase tracking-widest'>Search Catalog</h3>
              <input 
                type='text' 
                placeholder='Search products...' 
                value={searchQuery}
                onChange={handleSearchChange}
                className='w-full pl-4 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-950 transition-all'
              />
            </div>
            
            <div className='space-y-3'>
              <h3 className='text-xs font-semibold text-neutral-400 uppercase tracking-widest'>Categories</h3>
              <div className='flex flex-wrap gap-2'>
                {['Men', 'Women', 'Kids'].map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${category === cat ? 'bg-neutral-950 border-neutral-950 text-white shadow-sm' : 'bg-white border-neutral-200 text-neutral-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS SIDE */}
        <div className='flex-1 w-full space-y-10'>
          
          {/* Header Controls (Desktop) */}
          <div className='hidden lg:flex justify-between items-center bg-neutral-50/50 p-3 rounded-2xl border border-neutral-100'>
            <div className='text-sm text-neutral-500 font-light pl-2'>
              Showing <span className='font-semibold text-neutral-800'>{products.length}</span> of <span className='font-semibold text-neutral-800'>{total}</span> products
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-sm text-neutral-400 font-light'>Sort by:</span>
              <select 
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className='py-1.5 px-4 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none'
              >
                <option value='-createdAt'>Newest First</option>
                <option value='price'>Price: Low to High</option>
                <option value='-price'>Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingGrid count={12} />
          ) : products.length === 0 ? (
            <div className='text-center py-20 bg-neutral-50/40 rounded-3xl border border-dashed border-neutral-200/60 max-w-2xl mx-auto'>
              <p className='text-neutral-400 text-base font-light'>No items matching your selection were found.</p>
              <button 
                onClick={() => { setCategory(''); setSearchQuery(''); setSort('-createdAt'); setSearchParams({}); }}
                className='mt-4 px-6 py-2 bg-neutral-950 text-white rounded-full text-xs font-medium hover:bg-neutral-800 transition-colors shadow'
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <ScrollReveal>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10'>
                {products.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              </ScrollReveal>

              {/* High-End Pagination Controls */}
              {totalPages > 1 && (
                <div className='flex justify-center items-center gap-2 pt-10 border-t border-neutral-100'>
                  <button 
                    onClick={() => setPage(p => Math.max(1, p-1))} 
                    disabled={page === 1}
                    className='w-11 h-11 border border-neutral-200 rounded-full flex items-center justify-center text-neutral-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 active:bg-neutral-100 transition-colors'
                  >
                    <ChevronLeft className='w-5 h-5' />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-11 h-11 rounded-full text-sm font-medium transition-all ${page === pageNum ? 'bg-neutral-950 text-white shadow-sm' : 'border border-transparent text-neutral-600 hover:bg-neutral-50'}`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p+1))} 
                    disabled={page >= totalPages}
                    className='w-11 h-11 border border-neutral-200 rounded-full flex items-center justify-center text-neutral-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-50 active:bg-neutral-100 transition-colors'
                  >
                    <ChevronRight className='w-5 h-5' />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Collection
