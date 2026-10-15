import { createContext, useContext, useState, useEffect } from "react";
import { mockProducts } from "../data/mockProducts";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]')
    } catch {
      return []
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev
      }
      return [...prev, productId]
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.includes(productId)
  }

  const getWishlistProducts = () => {
    return wishlist
      .map(id => mockProducts.find(p => p._id === id))
      .filter(Boolean)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        getWishlistProducts
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);