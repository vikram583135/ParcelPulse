import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../api/client'

const DEMO_ACCOUNTS = [
  { label: 'Advertiser', sub: 'nike@demo.com', email: 'nike@demo.com', password: 'demo123' },
  { label: 'Agent', sub: 'ravi@demo.com', email: 'ravi@demo.com', password: 'demo123' },
  { label: 'Rider', sub: 'arun@demo.com', email: 'arun@demo.com', password: 'demo123' },
  { label: 'Admin', sub: 'admin@parcelpulse.com', email: 'admin@parcelpulse.com', password: 'admin123' },
]

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login({ email, password })
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
    setLoading(true)
    try {
      const res = await login({ email: account.email, password: account.password })
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="auth-logo">ParcelPulse</div>
          <p className="auth-subtitle">Verified Advertising on Delivery</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{
            background: '#fde8e8', color: '#c0392b', padding: '10px 14px',
            borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
          }}>{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>

        <div className="auth-demo">
          <h4>Quick Demo Access</h4>
          <div className="demo-accounts">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.email} className="demo-account-btn" onClick={() => handleDemoLogin(acc)}>
                {acc.label}
                <span>{acc.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
