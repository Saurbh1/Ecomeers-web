import React, { useState } from 'react'
import SafeImage from './SafeImage'
import { PLACEHOLDER_IMAGE } from '../utils/productImages'

const ImageZoom = ({ src, alt, className = '' }) => {
  const [zoom, setZoom] = useState(false)
  const [pos, setPos] = useState({ x: 50, y: 50 })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return (
    <div
      className={`relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-lg cursor-zoom-in ${className}`}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={onMove}
    >
      <SafeImage
        src={src}
        alt={alt}
        fallback={PLACEHOLDER_IMAGE}
        className='w-full h-full object-cover object-center transition-transform duration-200 motion-reduce:transition-none'
        style={
          zoom
            ? { transform: 'scale(1.75)', transformOrigin: `${pos.x}% ${pos.y}%` }
            : undefined
        }
      />
    </div>
  )
}

export default ImageZoom
