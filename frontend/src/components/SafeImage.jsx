import React, { useState, useEffect } from 'react'
import { PLACEHOLDER_IMAGE } from '../utils/productImages'

/**
 * Renders product/media images with automatic fallback on load error.
 * Never leaves a blank box.
 */
const SafeImage = ({
  src,
  alt = '',
  className = '',
  fallback = PLACEHOLDER_IMAGE,
  loading = 'lazy',
  decoding = 'async',
  width,
  height,
  style,
  ...rest
}) => {
  const initial = src && String(src).trim() ? src : fallback
  const [current, setCurrent] = useState(initial)

  useEffect(() => {
    setCurrent(src && String(src).trim() ? src : fallback)
  }, [src, fallback])

  const handleError = () => {
    if (current !== fallback) setCurrent(fallback)
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      style={style}
      onError={handleError}
      {...rest}
    />
  )
}

export default SafeImage
