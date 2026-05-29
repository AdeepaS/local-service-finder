import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [errorMsg, setErrorMsg] = useState('')
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await register(name, email, password, role)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{errorMsg}</div>}
          
          <div>
            <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              id="register-name" 
              type="text" 
              placeholder="Your name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
              required
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              id="register-email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
              required
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="register-password"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm" 
              required
            />
          </div>

          <div>
            <label htmlFor="register-role" className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
            <select 
              id="register-role"
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
            >
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-2.5 rounded-lg transition-colors mt-6">
            Create Account
          </button>
          
          <div className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:text-secondary font-medium">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
