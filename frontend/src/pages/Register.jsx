function Register() {
  return (
    <div className="container page auth-page">
      <h1>Register</h1>
      <form className="auth-form">
        <label htmlFor="register-name">Full Name</label>
        <input id="register-name" type="text" placeholder="Your name" />

        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" placeholder="you@example.com" />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          placeholder="Create password"
        />

        <button type="button">Create Account</button>
      </form>
    </div>
  )
}

export default Register
