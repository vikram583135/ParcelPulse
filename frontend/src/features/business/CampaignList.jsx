import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCampaignsByAdvertiser, activateCampaign } from '../../api/client'
import { Target, TrendingUp } from 'lucide-react'

const statusBadge = (status) => {
  const map = { DRAFT: 'badge-draft', ACTIVE: 'badge-active', PAUSED: 'badge-warning', COMPLETED: 'badge-success' }
  return <span className={`badge ${map[status] || 'badge-draft'}`}>{status}</span>
}

export default function CampaignList({ userId }) {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  const load = async () => {
    try {
      const res = await getCampaignsByAdvertiser(userId)
      setCampaigns(res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { load() }, [userId])

  const handleActivate = async (id) => {
    try {
      await activateCampaign(id)
      load()
    } catch (e) { alert(e.response?.data?.error || 'Failed') }
  }

  return (
    <div className="fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>My Campaigns</h1>
          <p>Manage your advertising campaigns</p>
        </div>
        <button className="btn btn-primary" onClick={() => nav('/business/create')}>+ New Campaign</button>
      </div>

      {loading ? <p className="text-muted">Loading...</p> : campaigns.length === 0 ? (
        <div className="empty-state">
          <Target size={64} />
          <h3>No campaigns yet</h3>
          <p>Create your first campaign to start advertising on delivery packages</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Brand</th>
                <th>Target</th>
                <th>Budget</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.brandName}</td>
                  <td>{c.targetPlacements?.toLocaleString()} placements</td>
                  <td>₹{c.budget?.toLocaleString()}</td>
                  <td>
                    {c.paymentType}
                    {c.discountApplied > 0 && <span className="text-sm text-muted"> (-₹{c.discountApplied})</span>}
                  </td>
                  <td>{statusBadge(c.status)}</td>
                  <td className="flex gap-sm">
                    {c.status === 'DRAFT' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleActivate(c.id)}>Activate</button>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={() => nav(`/business/dashboard/${c.id}`)}>
                      <TrendingUp size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
