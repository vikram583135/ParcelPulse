import { useState, useEffect } from 'react'
import { getAdminStickersOverview } from '../../api/client'
import { Package } from 'lucide-react'

export default function StickerOverview() {
  const [data, setData] = useState(null)
  useEffect(() => { getAdminStickersOverview().then(res => setData(res.data)) }, [])
  if (!data) return <p className="text-muted">Loading...</p>

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Sticker Inventory</h1><p>Complete sticker lifecycle overview</p></div>
      <div className="stats-grid">
        {[
          { label: 'Created', value: data.created, color: 'orange' },
          { label: 'With Agents', value: data.withAgents, color: 'blue' },
          { label: 'With Riders', value: data.withRiders, color: 'blue' },
          { label: 'Used', value: data.used, color: 'green' },
          { label: 'Damaged', value: data.damaged, color: 'red' }
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}><Package size={22} /></div>
            <div className="stat-value">{s.value || 0}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>All Stickers ({data.stickers?.length || 0})</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Code</th><th>Campaign</th><th>Status</th><th>Agent</th><th>Rider</th></tr></thead>
            <tbody>
              {(data.stickers || []).slice(0, 100).map(s => (
                <tr key={s.id}>
                  <td><span className="font-mono">{s.stickerCode}</span></td>
                  <td>#{s.campaignId}</td>
                  <td><span className={`badge badge-${s.status?.toLowerCase().replace('_','-')}`}>{s.status?.replace('_',' ')}</span></td>
                  <td>{s.currentAgentId ? `#${s.currentAgentId}` : '—'}</td>
                  <td>{s.currentRiderId ? `#${s.currentRiderId}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
