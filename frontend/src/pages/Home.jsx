import React, { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { BANNER_IMAGES, CATEGORY_IMAGES, getProductImage } from '../utils/productImages'
import SafeImage from '../components/SafeImage'
import { LoadingGrid } from '../components/Loading'
import ProductCard from '../components/ProductCard'
import ScrollReveal from '../components/ScrollReveal'
import SEO from '../components/SEO'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, RefreshCw, Truck, Quote, Sparkles, TrendingUp } from 'lucide-react'

const testimonials = [
  { name: 'Elena Vasquez', role: 'Creative Director', text: 'The fabric quality is exceptional. Every piece feels tailored for modern living.', rating: 5 },
  { name: 'Marcus Reid', role: 'Architect', text: 'Minimal design, premium construction. This is my go-to for capsule wardrobes.', rating: 5 },
  { name: 'Priya Sharma', role: 'Founder', text: 'Fast delivery, beautiful packaging, and pieces that last season after season.', rating: 5 },
]

const banners = [
  { title: 'Summer Capsule', subtitle: 'Light layers for warm evenings', cta: 'Shop Women', link: '/collection?category=Women', image: BANNER_IMAGES.women },
  { title: 'Urban Essentials', subtitle: 'Refined streetwear for men', cta: 'Shop Men', link: '/collection?category=Men', image: BANNER_IMAGES.men },
]

const Home = () => {
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [featRes, trendRes] = await Promise.all([
          getProducts({ limit: 8 }),
          getProducts({ limit: 4, sort: '-price' }),
        ])
        setFeatured(featRes.data.products || [])
        setTrending(trendRes.data.products || [])
      } catch (err) {
        console.error(err)
        setFeatured([])
        setTrending([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <SEO
        title='Home'
        description='Shop premium fashion collections. Featured products, trending styles, and exclusive member offers.'
      />
      <div className='space-y-24 pb-16 animate-fade-in'>
        {/* Cinematic Hero */}
        <section className='relative h-[620px] md:h-[720px] rounded-3xl overflow-hidden bg-neutral-900 flex items-center group'>
          <motion.div
            className='absolute inset-0 z-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${assets.hero_img})` }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent z-10' />
          <div className='relative z-20 max-w-2xl text-white ml-6 md:ml-16 px-4 space-y-6'>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className='inline-flex items-center gap-2 text-xs md:text-sm font-semibold tracking-[0.25em] text-neutral-300 uppercase'
            >
              <Sparkles className='w-4 h-4' /> New Season Arrivals
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='text-4xl md:text-6xl font-light tracking-tight leading-[1.1]'
            >
              Designed for <br />
              <span className='font-semibold'>Modern Living</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='text-neutral-300 text-sm md:text-lg font-light leading-relaxed max-w-md'
            >
              Curated capsule collections with minimalist cuts, organic fabrics, and timeless comfort.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className='pt-2 flex flex-wrap gap-3'>
              <Link
                to='/collection'
                className='inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-full text-sm font-medium hover:bg-neutral-100 transition-all shadow-xl hover:-translate-y-0.5'
              >
                Explore Collection <ArrowRight className='w-4 h-4' />
              </Link>
              <Link
                to='/collection?sort=-price'
                className='inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-all'
              >
                View Trending
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Animated promo banners */}
        <ScrollReveal>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {banners.map((b, i) => (
              <Link
                key={b.title}
                to={b.link}
                className='relative h-[280px] rounded-2xl overflow-hidden group shadow-sm hover:shadow-premium transition-all'
              >
                <SafeImage
                  src={b.image}
                  alt={b.title}
                  className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/75 to-transparent' />
                <div className='absolute bottom-6 left-6 text-white'>
                  <p className='text-xs uppercase tracking-widest text-neutral-300 mb-1'>{b.subtitle}</p>
                  <h3 className='text-2xl font-light'>{b.title}</h3>
                  <span className='inline-flex items-center gap-1 mt-3 text-sm font-medium group-hover:gap-2 transition-all'>
                    {b.cta} <ArrowRight className='w-4 h-4' />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>

        {/* Categories */}
        <ScrollReveal>
          <section className='space-y-6'>
            <div className='flex flex-col md:flex-row justify-between items-baseline gap-2'>
              <div>
                <span className='text-xs font-semibold tracking-wider text-neutral-400 uppercase'>Shop By Category</span>
                <h2 className='text-2xl md:text-3xl font-light text-neutral-900 mt-1'>Curated Selections</h2>
              </div>
              <Link to='/collection' className='group text-sm font-medium text-neutral-600 hover:text-neutral-950 inline-flex items-center gap-1.5'>
                Browse all <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              {[
            { name: 'Men', desc: 'Sleek casuals & tailored fits', link: '/collection?category=Men', image: CATEGORY_IMAGES.Men },
            { name: 'Women', desc: 'Minimalist silhouettes', link: '/collection?category=Women', image: CATEGORY_IMAGES.Women },
            { name: 'Kids', desc: 'Premium cotton playwear', link: '/collection?category=Kids', image: CATEGORY_IMAGES.Kids },
              ].map((cat) => (
                <Link key={cat.name} to={cat.link} className='relative h-[300px] rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-all'>
                  <SafeImage
                    src={cat.image}
                    alt={cat.name}
                    className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                  <div className='absolute bottom-6 left-6 text-white'>
                    <h3 className='text-xl font-semibold'>{cat.name}</h3>
                    <p className='text-xs text-neutral-300 font-light mt-1'>{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Featured */}
        <ScrollReveal>
          <section className='space-y-8'>
            <div className='text-center max-w-xl mx-auto space-y-2'>
              <span className='text-xs font-semibold tracking-widest text-neutral-400 uppercase'>Customer Favorites</span>
              <h2 className='text-3xl md:text-4xl font-light text-neutral-900'>Bestselling Products</h2>
            </div>
            {loading ? (
              <LoadingGrid count={8} />
            ) : (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10'>
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* Trending */}
        <ScrollReveal delay={0.1}>
          <section className='space-y-8 bg-neutral-950 text-white rounded-3xl p-8 md:p-14'>
            <div className='flex items-center gap-3'>
              <TrendingUp className='w-6 h-6 text-luxury-gold' />
              <div>
                <span className='text-xs font-semibold tracking-widest text-neutral-400 uppercase'>Trending Now</span>
                <h2 className='text-2xl md:text-3xl font-light mt-1'>Most Loved This Week</h2>
              </div>
            </div>
            {loading ? (
              <LoadingGrid count={4} />
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                {trending.map((p) => (
                  <Link key={p._id} to={`/product/${p._id}`} className='group space-y-3'>
                    <div className='aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-800'>
                      <SafeImage src={getProductImage(p)} alt={p.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                    </div>
                    <p className='text-sm font-medium line-clamp-1'>{p.title}</p>
                    <p className='text-sm text-neutral-400'>${p.price.toFixed(2)}</p>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </ScrollReveal>

        {/* Testimonials */}
        <ScrollReveal>
          <section className='space-y-10'>
            <div className='text-center'>
              <span className='text-xs font-semibold tracking-widest text-neutral-400 uppercase'>Reviews</span>
              <h2 className='text-3xl font-light text-neutral-900 mt-2'>What Our Clients Say</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {testimonials.map((t) => (
                <div key={t.name} className='p-8 rounded-2xl border border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow'>
                  <Quote className='w-8 h-8 text-neutral-200 mb-4' />
                  <p className='text-neutral-600 text-sm font-light leading-relaxed mb-6'>&ldquo;{t.text}&rdquo;</p>
                  <p className='font-medium text-neutral-900'>{t.name}</p>
                  <p className='text-xs text-neutral-400'>{t.role}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Trust badges */}
        <ScrollReveal>
          <section className='bg-neutral-50 rounded-3xl p-8 md:p-16 border border-neutral-100/50'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
              {[
                { icon: Truck, title: 'Complimentary Delivery', desc: 'Free worldwide shipping on orders above $150.' },
                { icon: RefreshCw, title: '30-Day Returns', desc: 'Hassle-free returns within 30 days of delivery.' },
                { icon: ShieldCheck, title: 'Secure Payments', desc: 'Encrypted checkout with industry-leading gateways.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className='flex flex-col items-center text-center space-y-4'>
                  <div className='w-14 h-14 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center'>
                    <Icon className='w-6 h-6' />
                  </div>
                  <h3 className='text-lg font-medium'>{title}</h3>
                  <p className='text-neutral-500 text-sm font-light max-w-xs'>{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal>
          <section className='relative rounded-3xl overflow-hidden bg-neutral-950 text-white p-8 md:p-16 text-center max-w-5xl mx-auto'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.15),transparent_50%)]' />
            <span className='inline-block text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase relative z-10'>Join the Club</span>
            <h2 className='text-3xl md:text-5xl font-light tracking-tight max-w-lg mx-auto mt-4 relative z-10'>
              Subscribe for <span className='font-semibold'>Exclusive Access</span>
            </h2>
            <form
              onSubmit={(e) => { e.preventDefault(); alert('Subscribed! Welcome to Luxe Commerce.') }}
              className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-8 relative z-10'
            >
              <input type='email' placeholder='Enter your email' required className='flex-1 px-5 py-3.5 bg-neutral-900 border border-neutral-800 rounded-full text-sm focus:outline-none focus:border-white' />
              <button type='submit' className='px-8 py-3.5 bg-white text-neutral-950 font-medium text-sm rounded-full hover:bg-neutral-100'>Subscribe</button>
            </form>
          </section>
        </ScrollReveal>
      </div>
    </>
  )
}

export default Home
