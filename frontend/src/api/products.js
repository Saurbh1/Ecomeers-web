import api, { notifyApiFallback } from './axios'
import { mockProducts } from '../data/mockProducts'
import { enrichProduct, enrichProducts, normalizeCategory, filterByCategory } from '../utils/productImages'

let fallbackNotified = false
const notifyOnce = () => {
  if (!fallbackNotified) {
    fallbackNotified = true
    notifyApiFallback('Showing offline catalog — all features still work')
  }
}

// Fallback function for products
const getProductsWithFallback = async (params) => {
  try {
    const response = await api.get('/products', { params })
    const products = enrichProducts(response.data.products || [])
    return { ...response, data: { ...response.data, products, total: response.data.total ?? products.length } }
  } catch (err) {
    notifyOnce()
    console.warn('API failed, using fallback mock data:', err.message)
    
    // Fallback logic
    const { page = 1, limit = 12, category, q, sort } = params || {}
    
    let filtered = [...mockProducts]
    
    // Apply category filter
    if (category) {
      filtered = filterByCategory(filtered, category)
    }
    
    // Apply search filter
    if (q) {
      const query = q.toLowerCase()
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    if (sort === '-createdAt' || !sort) {
      filtered.reverse()
    } else if (sort === 'price') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sort === '-price') {
      filtered.sort((a, b) => b.price - a.price)
    }
    
    // Apply pagination
    const skip = (page - 1) * limit
    const paginatedProducts = filtered.slice(skip, skip + limit)
    
    return {
      data: {
        products: enrichProducts(paginatedProducts),
        total: filtered.length
      }
    }
  }
}

// Fallback function for single product
const getProductWithFallback = async (id) => {
  try {
    const response = await api.get(`/products/${id}`)
    return { ...response, data: enrichProduct(response.data) }
  } catch (err) {
    notifyOnce()
    console.warn('API failed, using fallback mock product:', err.message)
    
    const product = mockProducts.find(p => p._id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    
    return { data: enrichProduct(product) }
  }
}

export const getProducts = (params) => getProductsWithFallback(params)
export const getProduct = (id) => getProductWithFallback(id)
