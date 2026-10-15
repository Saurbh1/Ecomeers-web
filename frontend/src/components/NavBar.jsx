import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { Heart, ShoppingCart, Menu, X, LogOut, LogIn, UserPlus } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const NavBar = () => {
  const [visible, setVisible] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const { user, logout } = useContext(AuthContext)
  const { items } = useContext(CartContext)
  const { wishlist } = useWishlist()

  const cartCount = items.reduce((s, it) => s + it.quantity, 0)

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/collection', label: 'Collection' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className='sticky top-0 z-40 glass border-b border-neutral-200 dark:border-neutral-800 pt-[env(safe-area-inset-top,0)]'>
      <div className='max-w-7xl mx-auto px-3 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 sm:h-20'>
          
          {/* Logo */}
          <Link to='/' className='flex-shrink-0 transition-opacity duration-300 hover:opacity-80'>
            <img src={assets.logo} alt='Logo' className='h-10 object-contain' />
          </Link>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center gap-12'>
            <div className='flex gap-8'>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'text-neutral-900 border-b-2 border-neutral-900'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right Icons */}
          <div className='flex items-center gap-3 sm:gap-5'>
            <ThemeToggle className='hidden sm:flex' />

            {/* Wishlist Icon */}
            <Link
              to='/wishlist'
              className='relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-300'
              title='Wishlist'
            >
              <Heart
                size={20}
                className={wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}
              />
              {wishlist.length > 0 && (
                <span className='absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in'>
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to='/cart'
              className='relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-300'
              title='Cart'
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className='absolute -top-2 -right-2 w-5 h-5 bg-neutral-900 text-white text-xs font-bold rounded-full flex items-center justify-center'>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown - Desktop */}
            <div className='hidden md:block relative'>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className='p-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-300'
                title='Profile'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className='absolute right-0 mt-2 w-48 glass border border-neutral-200 rounded-lg shadow-xl py-2 animate-slide-down'>
                  {user ? (
                    <>
                      <div className='px-4 py-2 text-sm text-neutral-600 border-b border-neutral-200'>
                        {user.name}
                      </div>
                      <Link
                        to='/profile'
                        onClick={() => setProfileOpen(false)}
                        className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors'
                      >
                        My Profile
                      </Link>
                      <Link
                        to='/order'
                        onClick={() => setProfileOpen(false)}
                        className='block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors'
                      >
                        My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          to='/admin'
                          onClick={() => setProfileOpen(false)}
                          className='block px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors'
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2'
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to='/login'
                        onClick={() => setProfileOpen(false)}
                        className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors'
                      >
                        <LogIn size={16} />
                        Login
                      </Link>
                      <Link
                        to='/register'
                        onClick={() => setProfileOpen(false)}
                        className='flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors'
                      >
                        <UserPlus size={16} />
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setVisible(!visible)}
              className='md:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors'
            >
              {visible ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {visible && (
        <div className='md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm animate-slide-down max-h-[80dvh] overflow-y-auto overscroll-contain'>
          <div className='px-4 py-4 space-y-2 safe-bottom'>
            <div className='flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800 mb-2'>
              <span className='text-xs text-neutral-400 uppercase tracking-wider'>Menu</span>
              <ThemeToggle />
            </div>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-900 font-medium'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            {/* Mobile Auth Links */}
            <div className='border-t border-neutral-200 pt-4 mt-4 space-y-2'>
              {user ? (
                <>
                  <Link
                    to='/profile'
                    onClick={() => setVisible(false)}
                    className='block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors'
                  >
                    My Profile
                  </Link>
                  <Link
                    to='/order'
                    onClick={() => setVisible(false)}
                    className='block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors'
                  >
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to='/admin'
                      onClick={() => setVisible(false)}
                      className='block px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition-colors'
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setVisible(false)
                    }}
                    className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    onClick={() => setVisible(false)}
                    className='block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    onClick={() => setVisible(false)}
                    className='block px-4 py-2 text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors'
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar