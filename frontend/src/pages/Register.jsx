import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'

const Register = () => {
  const { register } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Please fill in all registration fields.')
      return
    }
    try {
      setLoading(true)
      const res = await register({ name, email, password })
      toast.success(`Welcome to our platform, ${res.data.user.name}!`)
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in'>
      <div className='max-w-md w-full space-y-8 bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm'>
        
        {/* Title */}
        <div className='text-center space-y-2'>
          <span className='text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase'>Authentication</span>
          <h2 className='text-3xl font-light text-neutral-900'>Create Account</h2>
          <p className='text-sm text-neutral-500 font-light'>Join our platform for an elevated fashion & home lifestyle catalog.</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className='mt-8 space-y-6'>
          <div className='space-y-4'>
            {/* Full Name */}
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'><User className='w-3.5 h-3.5' /> Full Name</label>
              <input 
                type='text'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='John Doe'
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                required
              />
            </div>

            {/* Email Address */}
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'><Mail className='w-3.5 h-3.5' /> Email Address</label>
              <input 
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='name@example.com'
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                required
              />
            </div>

            {/* Password */}
            <div className='space-y-1'>
              <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'><Lock className='w-3.5 h-3.5' /> Password</label>
              <input 
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Min 6 characters'
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                required
              />
            </div>
          </div>

          <div className='pt-2'>
            <button 
              type='submit' 
              disabled={loading}
              className='w-full py-3.5 bg-neutral-950 text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-50'
            >
              {loading ? 'Registering...' : 'Create Account'}
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        </form>

        <div className='text-center pt-2'>
          <p className='text-sm font-light text-neutral-500'>
            Already have an account?{' '}
            <Link to='/login' className='font-semibold text-neutral-900 hover:underline'>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
