import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../api/axios'
import { AuthContext } from './AuthContext'
import { mockProducts } from '../data/mockProducts'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
        setItems(local)
        return
      }
      try {
        const res = await api.get('/cart', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        setItems(res.data)
      } catch (err) {
        console.error('Cart fetch failed, using localStorage:', err)
        const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
        setItems(local)
      }
    }
    fetchCart()
  }, [user])

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
      const idx = local.findIndex(i => i.product === productId)
      if (idx > -1) {
        local[idx].quantity += quantity
      } else {
        local.push({ product: productId, quantity })
      }
      localStorage.setItem('local_cart', JSON.stringify(local))
      setItems(local)
      return
    }
    try {
      const res = await api.post('/cart/add', { productId, quantity }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setItems(res.data)
    } catch (err) {
      console.error('Add to cart failed, using localStorage:', err)
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
      const idx = local.findIndex(i => i.product === productId)
      if (idx > -1) {
        local[idx].quantity += quantity
      } else {
        local.push({ product: productId, quantity })
      }
      localStorage.setItem('local_cart', JSON.stringify(local))
      setItems(local)
    }
  }

  const removeFromCart = async (productId) => {
    if (!user) {
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
      const filtered = local.filter(i => i.product !== productId)
      localStorage.setItem('local_cart', JSON.stringify(filtered))
      setItems(filtered)
      return
    }
    try {
      const res = await api.delete(`/cart/remove/${productId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setItems(res.data)
    } catch (err) {
      console.error('Remove from cart failed, using localStorage:', err)
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
      const filtered = local.filter(i => i.product !== productId)
      localStorage.setItem('local_cart', JSON.stringify(filtered))
      setItems(filtered)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId)
      return
    }
    if (!user) {
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
      const idx = local.findIndex(i => i.product === productId)
      if (idx > -1) {
        local[idx].quantity = quantity
      }
      localStorage.setItem('local_cart', JSON.stringify(local))
      setItems(local)
      return
    }
    try {
      const current = items.find(i => i.product === productId)
      const diff = quantity - (current ? current.quantity : 0)
      if (diff !== 0) {
        await addToCart(productId, diff)
      }
    } catch (err) {
      console.error('Update quantity failed:', err)
      const local = JSON.parse(localStorage.getItem('local_cart') || '[]')
      const idx = local.findIndex(i => i.product === productId)
      if (idx > -1) {
        local[idx].quantity = quantity
      }
      localStorage.setItem('local_cart', JSON.stringify(local))
      setItems(local)
    }
  }

  const clearCart = async () => {
    if (!user) {
      localStorage.removeItem('local_cart')
      setItems([])
      return
    }
    try {
      await api.delete('/cart/clear', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      setItems([])
    } catch (err) {
      console.error('Clear cart failed, clearing localStorage:', err)
      localStorage.removeItem('local_cart')
      setItems([])
    }
  }

  const getCartItemsWithProducts = () => {
    return items.map(item => {
      const product = mockProducts.find(p => p._id === item.product)
      return {
        ...item,
        productData: product || {
          _id: item.product,
          title: 'Product',
          price: 0,
          images: []
        }
      }
    })
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, setItems, getCartItemsWithProducts }}>
      {children}
    </CartContext.Provider>
  )
}
