/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { useState, useEffect } from 'react'
import { getReviewRequired, getPlacementEvidence, getVerificationByPlacement, adminDecision } from '../../api/client'
import { Shield, CheckCircle, XCircle, MapPin, Clock, Camera } from 'lucide-react'

export default function VerificationQueue({ adminId }) {
  const [queue, setQueue] = useState([])
  const [selected, setSelected] = useState(null)
  const [evidence, setEvidence] = useState(null)
  const [verification, setVerification] = useState(null)
  const [notes, setNotes] = useState('')
  const [msg, setMsg] = useState('')

  const load = () => { getReviewRequired().then(res => setQueue(res.data)) }
  useEffect(load, [])

  const viewEvidence = async (item) => {
    setSelected(item)
    setMsg('')
    try {
      const [evRes, verRes] = await Promise.all([
        getPlacementEvidence(item.placementId),
        getVerificationByPlacement(item.placementId)
      ])
      setEvidence(evRes.data)
      setVerification(verRes.data)
    } catch (e) { console.error(e) }
  }

  const handleDecision = async (decision) => {
    try {
      await adminDecision(selected.id, { adminId, decision, notes: notes || `Admin ${decision.toLowerCase()} this placement` })
      setMsg(`✅ Placement ${decision.toLowerCase()}!`)
      setSelected(null)
      setEvidence(null)
      load()
    } catch (e) { setMsg('❌ ' + (e.response?.data?.error || 'Failed')) }
  }

  const formatTime = (t) => t ? new Date(t).toLocaleString() : '—'

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Verification Queue</h1><p>Review flagged placements and make decisions</p></div>

      {msg && <div className="card mb-md" style={{ background: msg.startsWith('✅') ? '#e8faf0' : '#fde8e8' }}><p>{msg}</p></div>}

      {!selected ? (
        <>
          <div className="stat-card mb-md" style={{maxWidth:'300px'}}>
            <div className="stat-icon orange"><Shield size={22} /></div>
            <div className="stat-value">{queue.length}</div>
            <div className="stat-label">Awaiting Review</div>
          </div>

          {queue.length === 0 ? (
            <div className="empty-state"><Shield size={64} /><h3>All clear!</h3><p>No placements need review</p></div>
          ) : (
            <div className="table-container">
              <table>
                <thead><tr><th>ID</th><th>Placement</th><th>Status</th><th>Notes</th><th>Action</th></tr></thead>
                <tbody>
                  {queue.map(q => (
                    <tr key={q.id}>
                      <td>#{q.id}</td>
                      <td>Placement #{q.placementId}</td>
                      <td><span className="badge badge-warning">REVIEW REQUIRED</span></td>
                      <td className="text-sm truncate" style={{maxWidth:'300px'}}>{q.notes?.split('\n')[0]}</td>
                      <td><button className="btn btn-primary btn-sm" onClick={() => viewEvidence(q)}>Review</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div>
          <button className="btn btn-secondary mb-md" onClick={() => { setSelected(null); setEvidence(null) }}>← Back to Queue</button>

          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>Review: Placement #{selected.placementId}</h2>

          {evidence && (
            <div className="evidence-grid mb-md">
              <div className="evidence-card">
                <h3><Camera size={18} /> START Evidence</h3>
                {evidence.startPhotoUrl && <img src={evidence.startPhotoUrl} alt="Start" />}
                <div className="evidence-meta">
                  <div className="evidence-meta-item"><MapPin size={16} /> {evidence.placement?.startLatitude?.toFixed(4)}, {evidence.placement?.startLongitude?.toFixed(4)}</div>
                  <div className="evidence-meta-item"><Clock size={16} /> {formatTime(evidence.placement?.startTime)}</div>
                </div>
              </div>
              <div className="evidence-arrow">→</div>
              <div className="evidence-card">
                <h3><Camera size={18} /> END Evidence</h3>
                {evidence.endPhotoUrl && <img src={evidence.endPhotoUrl} alt="End" />}
                <div className="evidence-meta">
                  <div className="evidence-meta-item"><MapPin size={16} /> {evidence.placement?.endLatitude?.toFixed(4)}, {evidence.placement?.endLongitude?.toFixed(4)}</div>
                  <div className="evidence-meta-item"><Clock size={16} /> {formatTime(evidence.placement?.endTime)}</div>
                </div>
              </div>
            </div>
          )}

          {verification && (
            <div className="card mb-md">
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>Verification Checks</h3>
              <div className="verification-checks">
                {[
                  { label: 'Photo Check', passed: verification.photoCheckPassed },
                  { label: 'Sticker Match', passed: verification.stickerMatchPassed },
                  { label: 'Time Sequence', passed: verification.timeCheckPassed },
                  { label: 'GPS Distance', passed: verification.gpsCheckPassed },
                  { label: 'Duplicate Detection', passed: verification.duplicateCheckPassed },
                ].map(c => (
                  <div key={c.label} className={`verification-check ${c.passed ? 'pass' : c.passed === false ? 'fail' : 'review'}`}>
                    {c.passed ? <CheckCircle size={18} /> : <XCircle size={18} />} {c.label}: {c.passed ? 'PASSED' : 'FAILED'}
                  </div>
                ))}
              </div>
              {verification.notes && (
                <pre style={{ marginTop: '12px', fontSize: '0.8rem', background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
                  {verification.notes}
                </pre>
              )}
            </div>
          )}

          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>Admin Decision</h3>
            <div className="form-group">
              <label>Notes</label>
              <textarea className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add review notes..." />
            </div>
            <div className="flex gap-md">
              <button className="btn btn-success btn-lg" style={{flex:1}} onClick={() => handleDecision('VERIFIED')}>
                <CheckCircle size={18} /> Approve
              </button>
              <button className="btn btn-danger btn-lg" style={{flex:1}} onClick={() => handleDecision('REJECTED')}>
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
