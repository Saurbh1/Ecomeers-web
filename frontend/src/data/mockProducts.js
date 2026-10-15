import { productCatalog } from './productCatalog'
import { enrichProducts } from '../utils/productImages'

/** Canonical catalog with guaranteed title ↔ image ↔ category alignment */
export const mockProducts = enrichProducts(productCatalog)

export const mockCategories = ['Men', 'Women', 'Kids', 'Accessories']

export const mockBrands = ['Luxe Essentials']

export const mockSubCategories = [
  'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Footwear', 'Accessories', 'Eyewear', 'Watches',
]
