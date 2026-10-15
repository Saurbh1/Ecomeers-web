import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold mb-2'>Oops! Something went wrong</h1>
            <p className='text-gray-600 mb-4'>{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.href = '/'}
              className='px-4 py-2 bg-blue-600 text-white rounded'
            >
              Go Home
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
