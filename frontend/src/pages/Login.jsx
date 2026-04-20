function Login() {
  return (
    <div className="container page auth-page">
      <h1>Login</h1>
      <form className="auth-form">
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" placeholder="you@example.com" />

        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" placeholder="Enter password" />

        <button type="button">Login</button>
      </form>
    </div>
  )
}

export default Login
