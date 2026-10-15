const KEY = 'recently_viewed'
const MAX = 8

export function addRecentlyViewed(productId) {
  if (!productId) return
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || '[]')
    const next = [productId, ...list.filter((id) => id !== productId)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}
