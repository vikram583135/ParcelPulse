import { useState, useEffect } from 'react'
import { getAdminCampaigns, generateStickers, issueStickersToAgent, getUsersByRole } from '../../api/client'

export default function CampaignOverview({ adminId }) {
  const [campaigns, setCampaigns] = useState([])
  const [agents, setAgents] = useState([])
  const [genForm, setGenForm] = useState({ campaignId: '', quantity: 20 })
  const [issueForm, setIssueForm] = useState({ campaignId: '', agentId: '', quantity: 10 })
  const [msg, setMsg] = useState('')

  const load = () => {
    getAdminCampaigns().then(res => setCampaigns(res.data))
    getUsersByRole('AGENT').then(res => setAgents(res.data))
  }
  useEffect(load, [])

  const handleGenerate = async (e) => {
    e.preventDefault()
    try {
      await generateStickers({ campaignId: Number(genForm.campaignId), quantity: Number(genForm.quantity) })
      setMsg('✅ Stickers generated!')
      load()
    } catch (err) { setMsg('❌ ' + (err.response?.data?.error || 'Failed')) }
  }

  const handleIssue = async (e) => {
    e.preventDefault()
    try {
      await issueStickersToAgent({
        campaignId: Number(issueForm.campaignId), agentId: Number(issueForm.agentId), quantity: Number(issueForm.quantity)
      })
      setMsg('✅ Stickers issued to agent!')
    } catch (err) { setMsg('❌ ' + (err.response?.data?.error || 'Failed')) }
  }

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Campaign Management</h1><p>Generate stickers and issue to agents</p></div>

      {msg && <div className="card mb-md" style={{ background: msg.startsWith('✅') ? '#e8faf0' : '#fde8e8' }}><p>{msg}</p></div>}

      <div className="grid-2 mb-md">
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Generate Stickers</h3>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Campaign</label>
              <select className="form-control" value={genForm.campaignId} onChange={e => setGenForm(p => ({...p, campaignId: e.target.value}))} required>
                <option value="">Select...</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name} ({c.brandName})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" className="form-control" value={genForm.quantity} onChange={e => setGenForm(p => ({...p, quantity: e.target.value}))} min="1" max="1000" />
            </div>
            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Generate Stickers</button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Issue to Agent</h3>
          <form onSubmit={handleIssue}>
            <div className="form-group">
              <label>Campaign</label>
              <select className="form-control" value={issueForm.campaignId} onChange={e => setIssueForm(p => ({...p, campaignId: e.target.value}))} required>
                <option value="">Select...</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name} ({c.brandName})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Agent</label>
              <select className="form-control" value={issueForm.agentId} onChange={e => setIssueForm(p => ({...p, agentId: e.target.value}))} required>
                <option value="">Select...</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" className="form-control" value={issueForm.quantity} onChange={e => setIssueForm(p => ({...p, quantity: e.target.value}))} min="1" />
            </div>
            <button type="submit" className="btn btn-success" style={{width:'100%'}}>Issue Stickers</button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>All Campaigns</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Brand</th><th>Target</th><th>Budget</th><th>Status</th></tr></thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id}>
                  <td>#{c.id}</td><td>{c.name}</td><td>{c.brandName}</td>
                  <td>{c.targetPlacements}</td><td>₹{c.budget?.toLocaleString()}</td>
                  <td><span className={`badge badge-${c.status?.toLowerCase()}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
