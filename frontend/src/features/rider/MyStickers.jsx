/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { useState, useEffect } from 'react'
import { getRiderAvailableStickers } from '../../api/client'
import { Package } from 'lucide-react'

export default function MyStickers({ riderId }) {
  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRiderAvailableStickers(riderId).then(res => {
      setStickers(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [riderId])

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>My Stickers</h1>
        <p>Available stickers to use on delivery packages</p>
      </div>

      {loading ? <p className="text-muted">Loading...</p> : stickers.length === 0 ? (
        <div className="empty-state">
          <Package size={64} />
          <h3>No stickers available</h3>
          <p>Ask your agent to assign stickers to you</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {stickers.map(s => (
            <div key={s.id} className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', margin: '0 auto 12px',
                background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={28} color="white" />
              </div>
              <div className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 600 }}>{s.stickerCode}</div>
              <p className="text-sm text-muted mt-sm">Campaign #{s.campaignId}</p>
              <span className="badge badge-with-rider mt-sm">Ready to use</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
