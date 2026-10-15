import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, ArrowRight } from 'lucide-react'
import { toast } from 'react-toastify'

const Login = () => {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all credentials.')
      return
    }
    try {
      setLoading(false)
      const res = await login({ email, password })
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate('/')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className='min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in'>
      <div className='max-w-md w-full space-y-8 bg-white border border-neutral-100 p-8 rounded-3xl shadow-sm'>
        
        {/* Title */}
        <div className='text-center space-y-2'>
          <span className='text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase'>Authentication</span>
          <h2 className='text-3xl font-light text-neutral-900'>Welcome Back</h2>
          <p className='text-sm text-neutral-500 font-light'>Enter your details to sign in to your premium account.</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className='mt-8 space-y-6'>
          <div className='space-y-4'>
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
              <div className='flex justify-between items-center'>
                <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'><Lock className='w-3.5 h-3.5' /> Password</label>
                <a href='#' className='text-xs font-medium text-neutral-500 hover:text-black transition-colors'>Forgot?</a>
              </div>
              <input 
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter password'
                className='w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-neutral-950 transition-all'
                required
              />
            </div>
          </div>

          <div className='pt-2'>
            <button 
              type='submit' 
              disabled={loading}
              className='w-full py-3.5 bg-neutral-950 text-white rounded-full text-sm font-semibold hover:bg-neutral-800 transition-colors shadow flex items-center justify-center gap-2'
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        </form>

        <div className='text-center pt-2'>
          <p className='text-sm font-light text-neutral-500'>
            Don't have an account?{' '}
            <Link to='/register' className='font-semibold text-neutral-900 hover:underline'>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
