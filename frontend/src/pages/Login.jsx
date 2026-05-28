import { useState } from 'react'
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
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="container page auth-page">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {errorMsg && <div style={{color: 'red', marginBottom: '10px'}}>{errorMsg}</div>}
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
