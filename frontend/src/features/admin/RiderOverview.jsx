/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { useState, useEffect } from 'react'
import { getAdminRidersOverview } from '../../api/client'
import { Users } from 'lucide-react'

export default function RiderOverview() {
  const [data, setData] = useState(null)
  useEffect(() => { getAdminRidersOverview().then(res => setData(res.data)) }, [])
  if (!data) return <p className="text-muted">Loading...</p>

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Rider Overview</h1><p>All riders and their performance</p></div>

      <div className="card mb-md">
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Riders ({data.riders?.length || 0})</h3>
        <div className="table-container">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Active</th></tr></thead>
            <tbody>
              {(data.riders || []).map(r => (
                <tr key={r.id}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.email}</td>
                  <td>{r.phone || '—'}</td>
                  <td><span className={`badge ${r.active ? 'badge-success' : 'badge-danger'}`}>{r.active ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data.stats?.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Performance Stats</h3>
          <div className="table-container">
            <table>
              <thead><tr><th>Rider</th><th>Campaign</th><th>Assigned</th><th>Verified</th><th>Rejected</th><th>Earned</th><th>Bonus</th></tr></thead>
              <tbody>
                {data.stats.map(s => (
                  <tr key={s.id}>
                    <td>#{s.riderId}</td><td>#{s.campaignId}</td>
                    <td>{s.stickersAssigned}</td>
                    <td style={{color:'var(--accent-success)', fontWeight:600}}>{s.placementsVerified}</td>
                    <td style={{color:'var(--accent-danger)'}}>{s.placementsRejected}</td>
                    <td>₹{Number(s.totalEarned||0).toLocaleString()}</td>
                    <td>{s.bonusPaid ? '✅' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
