import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await login(email, password)
      toast.success('Login successful! Redirecting...', {
        duration: 2000,
        position: 'bottom-center',
        style: {
          background: '#bbf7d0',
          color: '#166534',
          fontWeight: '600',
          padding: '14px 18px',
          borderRadius: '8px',
          border: '1px solid #86efac',
        },
        iconTheme: {
          primary: '#16a34a',
          secondary: '#bbf7d0',
        },
      })
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed'
      setErrorMsg(errorMsg)
      toast.error('❌ ' + errorMsg, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: 'bold',
          padding: '16px',
          borderRadius: '8px',
        },
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{errorMsg}</div>}
          
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              id="login-email" 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              id="login-password" 
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
              required
            />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-2.5 rounded-lg transition-colors mt-6">
            Login
          </button>
          
          <div className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link to="/register" className="text-primary hover:text-secondary font-medium">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
