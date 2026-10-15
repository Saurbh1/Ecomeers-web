import React, { createContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch { return null }
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const saveUser = (u, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    setError(null)
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch {
      /* clear locally regardless */
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }

  const register = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const res = await authApi.register(data)
      saveUser(res.data.user, res.data.token)
      return res
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const res = await authApi.login(data)
      saveUser(res.data.user, res.data.token)
      return res
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data) => {
    try {
      setLoading(true)
      setError(null)
      const res = await authApi.updateProfile(data)
      const updatedUser = { ...user, name: res.data.name, address: res.data.address }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return res
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Update failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // could refresh token/profile here
  }, [])

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile, setUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}
