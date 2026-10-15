import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://your-domain.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/vite.svg`
const SITE_NAME = 'Luxe Commerce'

const SEO = ({ title, description, keywords, image, noindex }) => {
  const { pathname } = useLocation()

  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Premium Fashion & Lifestyle`
    const desc =
      description ||
      'Discover premium fashion, curated collections, and seamless checkout. Shop men, women, and kids with free shipping on orders over $150.'
    const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`
    const ogImage = image || DEFAULT_IMAGE

    document.title = pageTitle

    const setMeta = (name, content, attr = 'name') => {
      if (content == null) return
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    setMeta('description', desc)
    setMeta('keywords', keywords || 'ecommerce, premium fashion, online store, clothing, lifestyle')
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    setMeta('og:title', pageTitle, 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:url', canonical, 'property')
    setMeta('og:image', ogImage, 'property')
    setMeta('og:site_name', SITE_NAME, 'property')

    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', pageTitle)
    setMeta('twitter:description', desc)
    setMeta('twitter:image', ogImage)

    setLink('canonical', canonical)
  }, [title, description, keywords, image, pathname, noindex])

  return null
}

export default SEO
