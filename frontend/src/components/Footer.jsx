import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Share2, AtSign, Camera, Link2, ArrowRight } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className='bg-neutral-900 text-neutral-100 mt-32'>
      {/* Newsletter Section */}
      <div className='bg-gradient-to-r from-neutral-800 to-neutral-900 py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-8'>
            <h2 className='text-4xl font-light mb-4'>Stay Updated</h2>
            <p className='text-neutral-400 text-lg'>Get exclusive offers and updates delivered to your inbox</p>
          </div>
          
          <form onSubmit={handleSubscribe} className='flex flex-col sm:flex-row gap-3'>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='flex-1 px-6 py-4 bg-white/10 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all'
            />
            <button
              type='submit'
              className='px-8 py-4 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-100 transition-all duration-300 flex items-center justify-center gap-2 flex-shrink-0'
            >
              Subscribe
              <ArrowRight size={18} />
            </button>
          </form>
          
          {subscribed && (
            <p className='text-center text-green-400 mt-4 animate-fade-in'>Thank you for subscribing!</p>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12'>
          
          {/* Brand Section */}
          <div>
            <img src={assets.logo} className='h-10 mb-6 opacity-80 hover:opacity-100 transition-opacity' alt='Logo' />
            <p className='text-neutral-400 text-sm leading-relaxed mb-6'>
              Premium ecommerce platform delivering quality products and exceptional service to customers worldwide.
            </p>
            <div className='flex gap-4'>
              <a href='#' className='p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all'>
                <Share2 size={18} />
              </a>
              <a href='#' className='p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all'>
                <AtSign size={18} />
              </a>
              <a href='#' className='p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all'>
                <Camera size={18} />
              </a>
              <a href='#' className='p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-all'>
                <Link2 size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-medium mb-6'>Quick Links</h4>
            <ul className='space-y-3'>
              <li><Link to='/' className='text-neutral-400 hover:text-white transition-colors duration-300'>Home</Link></li>
              <li><Link to='/collection' className='text-neutral-400 hover:text-white transition-colors duration-300'>Collection</Link></li>
              <li><Link to='/about' className='text-neutral-400 hover:text-white transition-colors duration-300'>About</Link></li>
              <li><Link to='/contact' className='text-neutral-400 hover:text-white transition-colors duration-300'>Contact</Link></li>
              <li><Link to='/wishlist' className='text-neutral-400 hover:text-white transition-colors duration-300'>Wishlist</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='text-lg font-medium mb-6'>Customer Service</h4>
            <ul className='space-y-4'>
              <li><a href='#' className='text-neutral-400 hover:text-white transition-colors duration-300'>Order Tracking</a></li>
              <li><a href='#' className='text-neutral-400 hover:text-white transition-colors duration-300'>Returns</a></li>
              <li><a href='#' className='text-neutral-400 hover:text-white transition-colors duration-300'>FAQs</a></li>
              <li><a href='#' className='text-neutral-400 hover:text-white transition-colors duration-300'>Shipping Info</a></li>
              <li><a href='#' className='text-neutral-400 hover:text-white transition-colors duration-300'>Size Guide</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className='text-lg font-medium mb-6'>Get in Touch</h4>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3'>
                <Mail size={18} className='text-neutral-400 flex-shrink-0 mt-1' />
                <div>
                  <p className='text-sm text-neutral-400'>Email</p>
                  <a href='mailto:support@ecommerce.com' className='text-neutral-100 hover:text-white transition-colors'>support@ecommerce.com</a>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <Phone size={18} className='text-neutral-400 flex-shrink-0 mt-1' />
                <div>
                  <p className='text-sm text-neutral-400'>Phone</p>
                  <a href='tel:+18001234567' className='text-neutral-100 hover:text-white transition-colors'>+1 (800) 123-4567</a>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <MapPin size={18} className='text-neutral-400 flex-shrink-0 mt-1' />
                <div>
                  <p className='text-sm text-neutral-400'>Address</p>
                  <p className='text-neutral-100'>123 Premium St, Suite 100<br/>New York, NY 10001</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-neutral-800 my-8'></div>

        {/* Bottom Footer */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-neutral-400 text-sm'>
            &copy; 2026 Luxe Commerce. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <a href='#' className='text-neutral-400 hover:text-white text-sm transition-colors'>Privacy Policy</a>
            <a href='#' className='text-neutral-400 hover:text-white text-sm transition-colors'>Terms of Service</a>
            <a href='#' className='text-neutral-400 hover:text-white text-sm transition-colors'>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
