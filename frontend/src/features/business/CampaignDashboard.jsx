/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCampaignDashboard, getCampaignsByAdvertiser } from '../../api/client'
import { CheckCircle, Clock, XCircle, Target, Package, TrendingUp } from 'lucide-react'

export default function CampaignDashboard({ userId }) {
  const { id } = useParams()
  const [campaigns, setCampaigns] = useState([])
  const [selectedId, setSelectedId] = useState(id || null)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCampaignsByAdvertiser(userId).then(res => {
      setCampaigns(res.data)
      if (!selectedId && res.data.length > 0) setSelectedId(res.data[0].id)
    })
  }, [userId])

  useEffect(() => {
    if (selectedId) {
      setLoading(true)
      getCampaignDashboard(selectedId).then(res => {
        setDashboard(res.data)
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [selectedId])

  if (!selectedId || !dashboard) return (
    <div className="fade-in">
      <div className="page-header"><h1>Campaign Results</h1><p>Select a campaign to view results</p></div>
      {campaigns.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {campaigns.map(c => (
            <button key={c.id} className="btn btn-secondary" onClick={() => setSelectedId(c.id)}>{c.name}</button>
          ))}
        </div>
      ) : <p className="text-muted">No campaigns yet</p>}
    </div>
  )

  const c = dashboard.campaign
  const progress = dashboard.progressPercent || 0

  return (
    <div className="fade-in">
      <div className="page-header flex-between">
        <div>
          <h1>{c.name}</h1>
          <p>{c.brandName} — {c.targetArea}</p>
        </div>
        <select className="form-control" style={{ width: 'auto' }} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange"><Target size={22} /></div>
          <div className="stat-value">{c.targetPlacements?.toLocaleString()}</div>
          <div className="stat-label">Target Placements</div>
        </div>
        <div className="stat-card" style={{'--gradient-primary': 'var(--gradient-info)'}}>
          <div className="stat-icon blue"><Package size={22} /></div>
          <div className="stat-value">{dashboard.stickersDistributed || 0}</div>
          <div className="stat-label">Stickers Distributed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={22} /></div>
          <div className="stat-value">{dashboard.verifiedPlacements || 0}</div>
          <div className="stat-label">Verified Placements</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><TrendingUp size={22} /></div>
          <div className="stat-value">{progress.toFixed(1)}%</div>
          <div className="stat-label">Campaign Progress</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Placement Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="flex-between">
              <span className="flex gap-sm" style={{ alignItems: 'center' }}><Package size={16} /> Submitted</span>
              <strong>{dashboard.placementsSubmitted || 0}</strong>
            </div>
            <div className="flex-between">
              <span className="flex gap-sm" style={{ alignItems: 'center' }}><CheckCircle size={16} color="#27ae60" /> Verified</span>
              <strong style={{ color: '#27ae60' }}>{dashboard.verifiedPlacements || 0}</strong>
            </div>
            <div className="flex-between">
              <span className="flex gap-sm" style={{ alignItems: 'center' }}><Clock size={16} color="#f39c12" /> Under Review</span>
              <strong style={{ color: '#f39c12' }}>{dashboard.underReview || 0}</strong>
            </div>
            <div className="flex-between">
              <span className="flex gap-sm" style={{ alignItems: 'center' }}><XCircle size={16} color="#e74c3c" /> Rejected</span>
              <strong style={{ color: '#e74c3c' }}>{dashboard.rejected || 0}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Campaign Progress</h3>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-heading)',
              background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {progress.toFixed(1)}%
            </div>
            <p className="text-muted mt-sm">of target reached</p>
            <div className="progress-bar-container mt-md" style={{ height: '12px' }}>
              <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <p className="text-sm text-muted mt-md">
              {dashboard.verifiedPlacements || 0} of {c.targetPlacements?.toLocaleString()} verified
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
