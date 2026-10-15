import p_img1 from '../assets/p_img1.png'
import p_img2_1 from '../assets/p_img2_1.png'
import p_img11 from '../assets/p_img11.png'
import p_img3 from '../assets/p_img3.png'
import p_img4 from '../assets/p_img4.png'
import p_img5 from '../assets/p_img5.png'
import p_img6 from '../assets/p_img6.png'
import p_img7 from '../assets/p_img7.png'
import p_img8 from '../assets/p_img8.png'
import p_img10 from '../assets/p_img10.png'
import p_img12 from '../assets/p_img12.png'
import p_img13 from '../assets/p_img13.png'
import p_img14 from '../assets/p_img14.png'
import p_img15 from '../assets/p_img15.png'
import p_img17 from '../assets/p_img17.png'
import p_img18 from '../assets/p_img18.png'
import p_img20 from '../assets/p_img20.png'
import p_img21 from '../assets/p_img21.png'
import p_img22 from '../assets/p_img22.png'
import p_img26 from '../assets/p_img26.png'
import p_img28 from '../assets/p_img28.png'
import p_img40 from '../assets/p_img40.png'
import p_img43 from '../assets/p_img43.png'
import p_img47 from '../assets/p_img47.png'
import p_img34 from '../assets/p_img34.png'
import p_img35 from '../assets/p_img35.png'

export const PLACEHOLDER_IMAGE = p_img1

/** Category tiles & banners — visually match gender */
export const CATEGORY_IMAGES = {
  Men: p_img8,
  Women: p_img1,
  Kids: p_img6,
  Accessories: p_img12,
}

export const BANNER_IMAGES = {
  women: p_img1,
  men: p_img8,
  kids: p_img6,
  promo1: p_img5,
  promo2: p_img28,
}

const normalizeTitleKey = (title) =>
  (title || '')
    .toLowerCase()
    .trim()
    .replace(/['']/g, "'")
    .replace(/\s+/g, ' ')

/**
 * Stable title → bundled image map (canonical catalog + legacy titles).
 * Never map by _id alone — IDs differ between API/frontend but titles define the product.
 */
const BY_TITLE = {
  'premium cotton t-shirt': [p_img2_1, p_img8],
  'classic denim jeans': [p_img7, p_img15],
  "women's floral dress": [p_img1, p_img5],
  'casual sneakers': [p_img10, p_img7],
  'leather jacket': [p_img28, p_img40],
  "women's handbag": [p_img34, p_img13],
  "kids' adventure t-shirt": [p_img6, p_img3],
  'sunglasses classic': [p_img12],
  'sports track pants': [p_img7, p_img10],
  "women's summer shorts": [p_img20, p_img35],
  'formal shirt white': [p_img4, p_img11],
  'winter hoodie': [p_img12, p_img21],
  "kids' sneakers blue": [p_img43, p_img47],
  "women's yoga pants": [p_img22, p_img20],
  'watch classic black': [p_img17],
  'casual blazer navy': [p_img28, p_img40],
  'essential linen shirt': [p_img8, p_img4],
  'minimal high-waist trousers': [p_img20, p_img22],
  'organic cotton t-shirt': [p_img4, p_img8],
  'premium denim jacket': [p_img28],
  'silk camisole': [p_img1, p_img13],
  'cashmere knit sweater': [p_img21, p_img26],
  'classic chino shorts': [p_img7, p_img10],
  'minimalist leather belt': [p_img17],
  'premium activewear leggings': [p_img22, p_img35],
  'premium sneakers': [p_img8, p_img4],
  'luxury wool coat': [p_img26],
  'structured tote bag': [p_img34],
  'kids premium cotton set': [p_img6, p_img14],
  'wool blend dress pants': [p_img7, p_img15],
  'summer linen dress': [p_img1, p_img5],
  'premium sunglasses': [p_img18],
}

export const normalizeCategory = (category) => {
  if (!category) return ''
  const c = String(category).trim()
  const lower = c.toLowerCase()
  if (lower === 'men' || lower === 'man') return 'Men'
  if (lower === 'women' || lower === 'woman') return 'Women'
  if (lower === 'kids' || lower === 'kid' || lower === 'children') return 'Kids'
  if (lower === 'accessories' || lower === 'accessory') return 'Accessories'
  return c
}

const resolveBySemantics = (product) => {
  const cat = normalizeCategory(product.category)
  const title = (product.title || '').toLowerCase()
  const sub = (product.subCategory || '').toLowerCase()

  if (title.includes('jean') || title.includes('denim') || sub.includes('bottom') && title.includes('pant')) {
    if (cat === 'Women') return [p_img20, p_img22]
    if (cat === 'Kids') return [p_img14, p_img6]
    return [p_img7, p_img15]
  }
  if (title.includes('dress') || sub.includes('dress')) {
    if (cat === 'Kids') return [p_img6]
    return [p_img1, p_img5]
  }
  if (title.includes('sneaker') || sub.includes('shoe') || sub.includes('footwear')) {
    if (cat === 'Kids') return [p_img43, p_img47]
    return [p_img10, p_img7]
  }
  if (title.includes('jacket') || title.includes('blazer') || title.includes('coat') || sub.includes('outerwear')) {
    if (cat === 'Women') return [p_img26, p_img21]
    return [p_img28]
  }
  if (title.includes('hoodie') || title.includes('sweater')) return [p_img12, p_img21]
  if (title.includes('shirt') || title.includes('tee') || title.includes('t-shirt') || title.includes('top') || sub.includes('top')) {
    if (cat === 'Kids') return [p_img6, p_img3]
    if (cat === 'Women') return [p_img1, p_img13]
    return [p_img8, p_img4]
  }
  if (title.includes('short')) {
    if (cat === 'Women') return [p_img20, p_img35]
    return [p_img7, p_img10]
  }
  if (title.includes('bag') || title.includes('handbag') || title.includes('tote')) return [p_img34, p_img13]
  if (title.includes('sunglass') || sub.includes('eyewear')) return [p_img18]
  if (title.includes('watch')) return [p_img17]
  if (title.includes('yoga') || title.includes('legging')) return [p_img22, p_img35]
  if (title.includes('belt')) return [p_img17]

  if (cat === 'Men') return [p_img8]
  if (cat === 'Women') return [p_img1]
  if (cat === 'Kids') return [p_img6]
  if (cat === 'Accessories') return [p_img12]
  return [PLACEHOLDER_IMAGE]
}

export const getProductImages = (product) => {
  if (!product) return [PLACEHOLDER_IMAGE]

  const titleKey = normalizeTitleKey(product.title)
  if (BY_TITLE[titleKey]?.length) {
    return [...BY_TITLE[titleKey]]
  }

  return resolveBySemantics(product)
}

export const getProductImage = (product, index = 0) => {
  const images = getProductImages(product)
  return images[index] ?? images[0] ?? PLACEHOLDER_IMAGE
}

/** Normalize product: correct category, images[] only, no legacy image fields */
export const enrichProduct = (product) => {
  if (!product) return product

  const category = normalizeCategory(product.category)
  const images = getProductImages({ ...product, category })

  const { image, imageUrl, ...rest } = product
  return {
    ...rest,
    category,
    images,
  }
}

export const enrichProducts = (products) => (products || []).map(enrichProduct)

/** Strict category filter for client-side lists */
export const filterByCategory = (products, category) => {
  if (!category) return products
  const target = normalizeCategory(category)
  return products.filter((p) => normalizeCategory(p.category) === target)
}
