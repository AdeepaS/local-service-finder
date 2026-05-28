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
    <div className="container page auth-page">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <label htmlFor="register-name">Full Name</label>
        <input 
          id="register-name" 
          type="text" 
          placeholder="Your name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="register-email">Email</label>
        <input 
          id="register-email" 
          type="email" 
          placeholder="you@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  )
}

export default Register
