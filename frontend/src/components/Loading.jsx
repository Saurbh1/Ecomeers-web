import React from 'react'

const Skeleton = ({ className = '' }) => (
  <div className={`bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse rounded ${className}`}></div>
)

const LoadingGrid = ({ count = 12 }) => (
  <div className='space-y-6'>
    <Skeleton className='w-32 h-8' />
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='card overflow-hidden group'>
          <Skeleton className='w-full h-64 mb-4' />
          <div className='p-4 space-y-3'>
            <Skeleton className='w-3/4 h-5' />
            <Skeleton className='w-1/2 h-4' />
            <Skeleton className='w-2/3 h-6' />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const PageLoader = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='relative w-16 h-16'>
      <div className='absolute inset-0 rounded-full border-4 border-neutral-200'></div>
      <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-neutral-900 animate-spin'></div>
    </div>
  </div>
)

const ProductCardSkeleton = () => (
  <div className='card overflow-hidden'>
    <Skeleton className='w-full h-80' />
    <div className='p-6 space-y-4'>
      <Skeleton className='w-3/4 h-6' />
      <Skeleton className='w-1/2 h-5' />
      <div className='flex justify-between items-center pt-2'>
        <Skeleton className='w-1/4 h-6' />
        <Skeleton className='w-1/3 h-10 rounded-lg' />
      </div>
    </div>
  </div>
)

const TableRowSkeleton = ({ columns = 5 }) => (
  <div className='flex gap-4 p-4 border-b border-neutral-200'>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} className='flex-1 h-6' />
    ))}
  </div>
)

export { Skeleton, LoadingGrid, PageLoader, ProductCardSkeleton, TableRowSkeleton }
