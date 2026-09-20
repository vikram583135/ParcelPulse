/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { useState, useEffect } from 'react'
import { getAdminDashboard } from '../../api/client'
import { Megaphone, Package, Users, Shield, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboard().then(res => { setData(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-muted">Loading dashboard...</p>
  if (!data) return <p className="text-muted">Failed to load</p>

  const { campaigns, stickers, users, placements } = data

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System-wide overview of ParcelPulse operations</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orange"><Megaphone size={22} /></div>
          <div className="stat-value">{campaigns?.total || 0}</div>
          <div className="stat-label">Total Campaigns</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Package size={22} /></div>
          <div className="stat-value">{stickers?.total || 0}</div>
          <div className="stat-label">Total Stickers</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Users size={22} /></div>
          <div className="stat-value">{users?.riders || 0}</div>
          <div className="stat-label">Active Riders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Shield size={22} /></div>
          <div className="stat-value">{placements?.total || 0}</div>
          <div className="stat-label">Total Placements</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Campaign Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex-between"><span>Active</span><span className="badge badge-active">{campaigns?.active || 0}</span></div>
            <div className="flex-between"><span>Draft</span><span className="badge badge-draft">{campaigns?.draft || 0}</span></div>
            <div className="flex-between"><span>Completed</span><span className="badge badge-success">{campaigns?.completed || 0}</span></div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Sticker Pipeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex-between"><span>Created</span><strong>{stickers?.created || 0}</strong></div>
            <div className="flex-between"><span>With Agents</span><strong>{stickers?.withAgents || 0}</strong></div>
            <div className="flex-between"><span>With Riders</span><strong>{stickers?.withRiders || 0}</strong></div>
            <div className="flex-between"><span>Used</span><strong style={{color:'var(--accent-success)'}}>{stickers?.used || 0}</strong></div>
            <div className="flex-between"><span>Damaged</span><strong style={{color:'var(--accent-danger)'}}>{stickers?.damaged || 0}</strong></div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Verification Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex-between">
              <span className="flex gap-sm" style={{alignItems:'center'}}><CheckCircle size={16} color="#27ae60" /> Verified</span>
              <strong style={{color:'var(--accent-success)'}}>{placements?.verified || 0}</strong>
            </div>
            <div className="flex-between">
              <span className="flex gap-sm" style={{alignItems:'center'}}><Clock size={16} color="#f39c12" /> Review Required</span>
              <strong style={{color:'var(--accent-warning)'}}>{placements?.reviewRequired || 0}</strong>
            </div>
            <div className="flex-between">
              <span className="flex gap-sm" style={{alignItems:'center'}}><XCircle size={16} color="#e74c3c" /> Rejected</span>
              <strong style={{color:'var(--accent-danger)'}}>{placements?.rejected || 0}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Team</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex-between"><span>Advertisers</span><strong>{users?.advertisers || 0}</strong></div>
            <div className="flex-between"><span>Agents</span><strong>{users?.agents || 0}</strong></div>
            <div className="flex-between"><span>Riders</span><strong>{users?.riders || 0}</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
