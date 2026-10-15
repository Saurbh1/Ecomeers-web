// Fallback mock data — synced with frontend productCatalog.js (same _id, title, category)

const catalog = [
  { _id: '1', title: 'Premium Cotton T-Shirt', category: 'Men', subCategory: 'Tops', price: 49, stock: 45, ratings: 4.5 },
  { _id: '2', title: 'Classic Denim Jeans', category: 'Men', subCategory: 'Bottoms', price: 89, stock: 32, ratings: 4.7 },
  { _id: '3', title: "Women's Floral Dress", category: 'Women', subCategory: 'Dresses', price: 79, stock: 28, ratings: 4.6 },
  { _id: '4', title: 'Casual Sneakers', category: 'Men', subCategory: 'Footwear', price: 119, stock: 50, ratings: 4.8 },
  { _id: '5', title: 'Leather Jacket', category: 'Men', subCategory: 'Outerwear', price: 249, stock: 15, ratings: 4.9 },
  { _id: '6', title: "Women's Handbag", category: 'Women', subCategory: 'Accessories', price: 129, stock: 22, ratings: 4.4 },
  { _id: '7', title: "Kids' Adventure T-Shirt", category: 'Kids', subCategory: 'Tops', price: 29, stock: 60, ratings: 4.5 },
  { _id: '8', title: 'Sunglasses Classic', category: 'Accessories', subCategory: 'Eyewear', price: 59, stock: 40, ratings: 4.3 },
  { _id: '9', title: 'Sports Track Pants', category: 'Men', subCategory: 'Bottoms', price: 55, stock: 35, ratings: 4.6 },
  { _id: '10', title: "Women's Summer Shorts", category: 'Women', subCategory: 'Bottoms', price: 45, stock: 48, ratings: 4.5 },
  { _id: '11', title: 'Formal Shirt White', category: 'Men', subCategory: 'Tops', price: 69, stock: 38, ratings: 4.7 },
  { _id: '12', title: 'Winter Hoodie', category: 'Men', subCategory: 'Outerwear', price: 89, stock: 42, ratings: 4.8 },
  { _id: '13', title: "Kids' Sneakers Blue", category: 'Kids', subCategory: 'Footwear', price: 49, stock: 55, ratings: 4.6 },
  { _id: '14', title: "Women's Yoga Pants", category: 'Women', subCategory: 'Bottoms', price: 59, stock: 44, ratings: 4.7 },
  { _id: '15', title: 'Watch Classic Black', category: 'Accessories', subCategory: 'Watches', price: 149, stock: 30, ratings: 4.8 },
  { _id: '16', title: 'Casual Blazer Navy', category: 'Men', subCategory: 'Outerwear', price: 179, stock: 20, ratings: 4.7 },
]

const mockProducts = catalog.map((item) => ({
  ...item,
  description: `${item.title} — premium quality from Luxe Commerce.`,
  discount: 0,
  images: [],
  sizes: ['S', 'M', 'L'],
  colors: ['Default'],
  brand: 'Luxe Essentials',
  tags: [item.category.toLowerCase()],
  reviews: [],
  createdAt: new Date(),
}))

const mockUsers = [
  {
    _id: 'mock-user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    role: 'user',
    cartData: [],
    wishlist: [],
    isBlocked: false,
    createdAt: new Date(),
  },
]

const mockOrders = []

module.exports = {
  mockProducts,
  mockUsers,
  mockOrders,
}
