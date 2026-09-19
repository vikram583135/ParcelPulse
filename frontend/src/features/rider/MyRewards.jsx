import { useState, useEffect } from 'react'
import { getRiderRewardSummary } from '../../api/client'
import { Wallet, TrendingUp, Gift, IndianRupee } from 'lucide-react'

export default function MyRewards({ riderId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRiderRewardSummary(riderId).then(res => {
      setData(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [riderId])

  if (loading) return <p className="text-muted">Loading...</p>
  if (!data) return <p className="text-muted">No rewards data</p>

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>My Rewards</h1>
        <p>Track your earnings from verified placements</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange"><Wallet size={22} /></div>
          <div className="stat-value">₹{Number(data.totalEarned || 0).toLocaleString()}</div>
          <div className="stat-label">Total Earned</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={22} /></div>
          <div className="stat-value">₹{Number(data.credited || 0).toLocaleString()}</div>
          <div className="stat-label">Credited</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><IndianRupee size={22} /></div>
          <div className="stat-value">₹{Number(data.pending || 0).toLocaleString()}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      {/* Stats per campaign */}
      {data.stats && data.stats.length > 0 && (
        <div className="card mb-md">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Campaign Performance</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Campaign</th><th>Assigned</th><th>Verified</th><th>Rejected</th><th>Earned</th><th>Bonus</th></tr></thead>
              <tbody>
                {data.stats.map(s => (
                  <tr key={s.id}>
                    <td>#{s.campaignId}</td>
                    <td>{s.stickersAssigned}</td>
                    <td><strong style={{ color: 'var(--accent-success)' }}>{s.placementsVerified}</strong></td>
                    <td>{s.placementsRejected}</td>
                    <td>₹{Number(s.totalEarned || 0).toLocaleString()}</td>
                    <td>{s.bonusPaid ? <span className="badge badge-success">Paid</span> : s.bonusEligible ? <span className="badge badge-warning">Eligible</span> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent rewards */}
      {data.rewards && data.rewards.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Recent Rewards</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.rewards.map(r => (
              <div key={r.id} className="flex-between" style={{
                padding: '12px 16px', borderRadius: '8px', background: 'var(--bg-primary)'
              }}>
                <div>
                  <span className="flex gap-sm" style={{ alignItems: 'center' }}>
                    {r.type === 'COMPLETION_BONUS' ? <Gift size={16} color="var(--accent-warning)" /> : <IndianRupee size={16} color="var(--accent-success)" />}
                    <strong>{r.type === 'COMPLETION_BONUS' ? 'Completion Bonus' : 'Placement Reward'}</strong>
                  </span>
                  <span className="text-sm text-muted">Campaign #{r.campaignId}</span>
                </div>
                <strong style={{ color: 'var(--accent-success)', fontSize: '1.1rem' }}>+₹{Number(r.amount).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
