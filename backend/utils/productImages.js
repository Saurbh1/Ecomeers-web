/** Backend: normalize category only; images enriched on frontend by title */
const normalizeCategory = (category) => {
  if (!category) return ''
  const lower = String(category).trim().toLowerCase()
  if (lower === 'men' || lower === 'man') return 'Men'
  if (lower === 'women' || lower === 'woman') return 'Women'
  if (lower === 'kids' || lower === 'kid' || lower === 'children') return 'Kids'
  if (lower === 'accessories' || lower === 'accessory') return 'Accessories'
  return String(category).trim()
}

const ensureProductImages = (product) => {
  if (!product) return product
  const category = normalizeCategory(product.category)
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : []
  const { image, imageUrl, ...rest } = product
  return {
    ...rest,
    category,
    images,
  }
}

const ensureProducts = (products) => (products || []).map(ensureProductImages)

module.exports = { ensureProductImages, ensureProducts, normalizeCategory }
