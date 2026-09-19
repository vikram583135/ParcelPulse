import { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../../api/client'

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'RIDER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await register(form)
      onLogin(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <div className="auth-logo">ParcelPulse</div>
          <p className="auth-subtitle">Create your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={{
            background: '#fde8e8', color: '#c0392b', padding: '10px 14px',
            borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
          }}>{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input name="name" className="form-control" value={form.name}
              onChange={handleChange} placeholder="Your name" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" className="form-control" value={form.email}
                onChange={handleChange} placeholder="you@email.com" required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" className="form-control" value={form.phone}
                onChange={handleChange} placeholder="9876543210" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" className="form-control" value={form.password}
                onChange={handleChange} placeholder="Min 6 chars" required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange}>
                <option value="ADVERTISER">Advertiser</option>
                <option value="AGENT">Agent</option>
                <option value="RIDER">Rider</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  )
}
