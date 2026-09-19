import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCampaign } from '../../api/client'

export default function CreateCampaign({ userId }) {
  const nav = useNavigate()
  const [form, setForm] = useState({
    name: '', brandName: '', adDescription: '', targetArea: 'Bangalore',
    targetPlacements: 100, budget: 5000, paymentType: 'FULL', startDate: '', endDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const discount = form.paymentType === 'FULL' ? (form.budget * 0.1) : 0
  const amountPayable = form.budget - discount

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createCampaign({ ...form, advertiserId: userId })
      nav('/business')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create campaign')
    } finally { setLoading(false) }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Create Campaign</h1>
        <p>Set up a new advertising campaign on delivery packages</p>
      </div>

      <div className="grid-2">
        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && <div style={{
              background: '#fde8e8', color: '#c0392b', padding: '10px 14px',
              borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px'
            }}>{error}</div>}

            <div className="form-group">
              <label>Campaign Name</label>
              <input name="name" className="form-control" value={form.name}
                onChange={handleChange} placeholder="e.g. Nike Summer Sprint" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Brand Name</label>
                <input name="brandName" className="form-control" value={form.brandName}
                  onChange={handleChange} placeholder="e.g. Nike" required />
              </div>
              <div className="form-group">
                <label>Target Area</label>
                <input name="targetArea" className="form-control" value={form.targetArea}
                  onChange={handleChange} placeholder="e.g. Bangalore" />
              </div>
            </div>

            <div className="form-group">
              <label>Ad Description</label>
              <textarea name="adDescription" className="form-control" value={form.adDescription}
                onChange={handleChange} placeholder="Describe the advertisement..." />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Placements</label>
                <input name="targetPlacements" type="number" className="form-control" value={form.targetPlacements}
                  onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label>Campaign Budget (₹)</label>
                <input name="budget" type="number" className="form-control" value={form.budget}
                  onChange={handleChange} min="100" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input name="startDate" type="date" className="form-control" value={form.startDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input name="endDate" type="date" className="form-control" value={form.endDate} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Payment Option</label>
              <select name="paymentType" className="form-control" value={form.paymentType} onChange={handleChange}>
                <option value="FULL">Full Payment (10% discount)</option>
                <option value="PARTIAL">Partial Payment (installments)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </form>
        </div>

        <div>
          <div className="card" style={{ background: 'var(--bg-elevated)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Payment Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex-between">
                <span className="text-muted">Campaign Budget</span>
                <strong>₹{Number(form.budget).toLocaleString()}</strong>
              </div>
              {discount > 0 && (
                <div className="flex-between">
                  <span style={{ color: 'var(--accent-success)' }}>Full Payment Discount (10%)</span>
                  <strong style={{ color: 'var(--accent-success)' }}>-₹{discount.toLocaleString()}</strong>
                </div>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
              <div className="flex-between">
                <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Amount Payable</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                  ₹{amountPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card mt-lg">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>Rider Economics</h3>
            <p className="text-sm text-muted" style={{ marginBottom: '12px' }}>ParcelPulse sets rider payments</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="flex-between text-sm">
                <span>Per Verified Placement</span><strong>₹10</strong>
              </div>
              <div className="flex-between text-sm">
                <span>100% Completion Bonus</span><strong>₹50</strong>
              </div>
              <div className="flex-between text-sm">
                <span>Minimum Usage Required</span><strong>50%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
