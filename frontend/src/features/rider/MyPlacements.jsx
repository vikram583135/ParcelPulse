/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { useState, useEffect } from 'react'
import { getPlacementsByRider } from '../../api/client'
import { CheckCircle, Clock, XCircle, Eye } from 'lucide-react'

const statusBadge = (status) => {
  const map = {
    STARTED: 'badge-info', SUBMITTED: 'badge-warning', VERIFIED: 'badge-success',
    REVIEW_REQUIRED: 'badge-warning', REJECTED: 'badge-danger'
  }
  return <span className={`badge ${map[status] || 'badge-draft'}`}>{status.replace('_', ' ')}</span>
}

export default function MyPlacements({ riderId }) {
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlacementsByRider(riderId).then(res => {
      setPlacements(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [riderId])

  const formatTime = (t) => t ? new Date(t).toLocaleString() : '—'

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>My Placements</h1>
        <p>Track all your advertisement placements and their status</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange"><Eye size={22} /></div>
          <div className="stat-value">{placements.length}</div>
          <div className="stat-label">Total Placements</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={22} /></div>
          <div className="stat-value">{placements.filter(p => p.status === 'VERIFIED').length}</div>
          <div className="stat-label">Verified</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Clock size={22} /></div>
          <div className="stat-value">{placements.filter(p => p.status === 'REVIEW_REQUIRED').length}</div>
          <div className="stat-label">Under Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><XCircle size={22} /></div>
          <div className="stat-value">{placements.filter(p => p.status === 'REJECTED').length}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {loading ? <p className="text-muted">Loading...</p> : placements.length === 0 ? (
        <div className="empty-state"><Eye size={64} /><h3>No placements yet</h3><p>Start by placing a sticker on a delivery package</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Sticker</th><th>Campaign</th><th>Start Time</th><th>End Time</th><th>Status</th></tr></thead>
            <tbody>
              {placements.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>#{p.stickerId}</td>
                  <td>#{p.campaignId}</td>
                  <td className="text-sm">{formatTime(p.startTime)}</td>
                  <td className="text-sm">{formatTime(p.endTime)}</td>
                  <td>{statusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
