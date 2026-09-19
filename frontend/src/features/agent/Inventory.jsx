import { useState, useEffect } from 'react'
import { getStickersByAgent } from '../../api/client'
import { Package } from 'lucide-react'

const statusBadge = (status) => {
  const map = {
    CREATED: 'badge-created', WITH_AGENT: 'badge-with-agent', WITH_RIDER: 'badge-with-rider',
    USED: 'badge-used', DAMAGED: 'badge-damaged', RETURNED: 'badge-draft'
  }
  return <span className={`badge ${map[status] || 'badge-draft'}`}>{status.replace('_', ' ')}</span>
}

export default function Inventory({ agentId }) {
  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStickersByAgent(agentId).then(res => {
      setStickers(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [agentId])

  const byStatus = stickers.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>My Sticker Inventory</h1>
        <p>Track all stickers assigned to you by ParcelPulse</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange"><Package size={22} /></div>
          <div className="stat-value">{stickers.length}</div>
          <div className="stat-label">Total Stickers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Package size={22} /></div>
          <div className="stat-value">{byStatus['WITH_AGENT'] || 0}</div>
          <div className="stat-label">Available to Assign</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Package size={22} /></div>
          <div className="stat-value">{byStatus['WITH_RIDER'] || 0}</div>
          <div className="stat-label">With Riders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Package size={22} /></div>
          <div className="stat-value">{byStatus['USED'] || 0}</div>
          <div className="stat-label">Used</div>
        </div>
      </div>

      {loading ? <p className="text-muted">Loading...</p> : stickers.length === 0 ? (
        <div className="empty-state"><Package size={64} /><h3>No stickers yet</h3><p>Stickers will appear here when issued by ParcelPulse</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Code</th><th>Campaign</th><th>Status</th><th>Rider</th></tr></thead>
            <tbody>
              {stickers.map(s => (
                <tr key={s.id}>
                  <td><span className="font-mono">{s.stickerCode}</span></td>
                  <td>#{s.campaignId}</td>
                  <td>{statusBadge(s.status)}</td>
                  <td>{s.currentRiderId ? `Rider #${s.currentRiderId}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
