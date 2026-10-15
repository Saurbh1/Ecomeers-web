import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, MapPin, Phone, Shield, ClipboardList, Heart, LayoutDashboard, LogOut, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user, logout, updateProfile } = useContext(AuthContext)
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.address?.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      })
    }
  }, [user])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await updateProfile({
        name: formData.name,
        address: {
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      })
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className='min-h-[50vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in'>
        <User className='w-12 h-12 text-neutral-300 mb-4' />
        <h3 className='text-lg font-medium text-neutral-900 mb-1'>Access Denied</h3>
        <p className='text-neutral-500 text-sm font-light mb-6'>Please authenticate to access your personal dashboard.</p>
        <Link to='/login' className='px-6 py-2.5 bg-neutral-950 text-white rounded-full text-xs font-semibold hover:bg-neutral-800 transition-all shadow'>
          Login / Register
        </Link>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto py-8 pb-20 animate-fade-in'>
      {/* Header */}
      <div className='mb-10 space-y-2'>
        <span className='text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase'>User Centre</span>
        <h1 className='text-3xl font-light tracking-tight text-neutral-900'>My Account Portal</h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
        
        {/* Navigation Sidebar */}
        <div className='bg-white border border-neutral-100 p-6 rounded-3xl space-y-6 shadow-sm'>
          <div className='flex items-center gap-4 pb-4 border-b border-neutral-100'>
            <div className='w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 font-semibold text-lg uppercase'>
              {user.name?.substring(0,2)}
            </div>
            <div>
              <h2 className='font-semibold text-neutral-950 text-base leading-tight'>{user.name}</h2>
              <span className='text-xs text-neutral-400 font-light flex items-center gap-1 mt-0.5'>
                <Shield className='w-3 h-3' /> Role: {user.role}
              </span>
            </div>
          </div>

          <div className='space-y-1'>
            <Link to='/order' className='flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-xl text-sm font-medium transition-all'>
              <ClipboardList className='w-4.5 h-4.5 text-neutral-400' />
              <span>Purchase History</span>
            </Link>
            <Link to='/wishlist' className='flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-xl text-sm font-medium transition-all'>
              <Heart className='w-4.5 h-4.5 text-neutral-400' />
              <span>My Wishlist</span>
            </Link>
            {user.role === 'admin' && (
              <Link to='/admin' className='flex items-center gap-3 px-4 py-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl text-sm font-medium transition-all'>
                <LayoutDashboard className='w-4.5 h-4.5 text-orange-400' />
                <span>Store Administration</span>
              </Link>
            )}
            <button onClick={handleLogout} className='w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-sm font-medium transition-all'>
              <LogOut className='w-4.5 h-4.5 text-rose-400' />
              <span>Log out of Session</span>
            </button>
          </div>
        </div>

        {/* Profile Details Panel */}
        <div className='md:col-span-2 bg-white border border-neutral-100 p-6 md:p-8 rounded-3xl shadow-sm'>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='flex justify-between items-center pb-4 border-b border-neutral-100'>
                <h3 className='text-lg font-semibold text-neutral-950'>Edit Information</h3>
                <button type='button' onClick={() => setIsEditing(false)} className='text-xs font-semibold text-neutral-400 hover:text-neutral-600'>Cancel</button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Full Name</label>
                  <input 
                    type='text'
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className='w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                    required
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Phone Number</label>
                  <input 
                    type='text'
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className='w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                  />
                </div>
              </div>

              <div className='space-y-4 pt-2'>
                <h4 className='text-xs font-bold text-neutral-900 tracking-widest uppercase'>Default Delivery Address</h4>
                
                <div className='space-y-1'>
                  <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Street Address</label>
                  <input 
                    type='text'
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                    placeholder='Apartment, suite, unit, building, floor, etc.'
                    className='w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>City</label>
                    <input 
                      type='text'
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className='w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                    />
                  </div>
                  <div className='space-y-1'>
                    <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>State / Province</label>
                    <input 
                      type='text'
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className='w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Postal / ZIP Code</label>
                    <input 
                      type='text'
                      value={formData.zipCode}
                      onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                      className='w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                    />
                  </div>
                  <div className='space-y-1'>
                    <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>Country</label>
                    <input 
                      type='text'
                      value={formData.country}
                      onChange={e => setFormData({ ...formData, country: e.target.value })}
                      className='w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                    />
                  </div>
                </div>
              </div>

              <div className='pt-4'>
                <button 
                  type='submit' 
                  disabled={loading}
                  className='w-full py-3.5 bg-neutral-950 text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50'
                >
                  {loading ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </div>
            </form>
          ) : (
            <div className='space-y-8'>
              <div className='flex justify-between items-center pb-4 border-b border-neutral-100'>
                <h3 className='text-lg font-semibold text-neutral-950'>Personal Profile</h3>
                <button onClick={() => setIsEditing(true)} className='text-xs font-semibold text-neutral-800 hover:text-black bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full transition-all'>
                  Edit Profile
                </button>
              </div>

              {/* Text detail display */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6'>
                <div className='space-y-1.5'>
                  <span className='text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'><User className='w-3.5 h-3.5' /> Full Name</span>
                  <p className='text-sm font-medium text-neutral-800'>{user.name}</p>
                </div>
                <div className='space-y-1.5'>
                  <span className='text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'><Mail className='w-3.5 h-3.5' /> Registered Email</span>
                  <p className='text-sm font-medium text-neutral-800'>{user.email}</p>
                </div>
                <div className='space-y-1.5'>
                  <span className='text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'><Phone className='w-3.5 h-3.5' /> Contact Phone</span>
                  <p className='text-sm font-medium text-neutral-800'>{user.address?.phone || <span className='text-neutral-300 font-light italic'>Not provided</span>}</p>
                </div>
              </div>

              <hr className='border-neutral-100' />

              {/* Delivery Address text display */}
              <div className='space-y-4'>
                <span className='text-xs font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-1.5'><MapPin className='w-3.5 h-3.5' /> Default Shipping Address</span>
                {user.address?.street ? (
                  <div className='bg-neutral-50 border border-neutral-100 p-5 rounded-2xl text-sm font-light text-neutral-600 space-y-0.5 relative overflow-hidden'>
                    <div className='absolute top-4 right-4 text-neutral-300'>
                      <CheckCircle2 className='w-5 h-5 text-neutral-400' />
                    </div>
                    <p className='font-semibold text-neutral-900'>{user.name}</p>
                    <p>{user.address.street}</p>
                    <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                    <p>{user.address.country}</p>
                  </div>
                ) : (
                  <div className='text-center py-8 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 flex flex-col items-center justify-center'>
                    <p className='text-xs text-neutral-400 font-light max-w-xs'>You have not added a default delivery address yet. Edit your profile to populate shipping options.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
