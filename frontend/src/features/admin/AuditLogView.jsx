import { useState, useEffect } from 'react'
import { getAuditLog } from '../../api/client'
import { FileText } from 'lucide-react'

export default function AuditLogView() {
  const [logs, setLogs] = useState([])
  useEffect(() => { getAuditLog().then(res => setLogs(res.data)) }, [])

  const formatTime = (t) => t ? new Date(t).toLocaleString() : '—'

  return (
    <div className="fade-in">
      <div className="page-header"><h1>Audit Log</h1><p>System-wide activity trail</p></div>

      {logs.length === 0 ? (
        <div className="empty-state"><FileText size={64} /><h3>No activity yet</h3></div>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map(l => (
              <div key={l.id} style={{ padding: '12px 16px', borderRadius: '8px', background: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="flex gap-sm" style={{alignItems:'center'}}>
                    <span className="badge badge-info">{l.action}</span>
                    <span className="text-sm"><strong>{l.entityType}</strong> #{l.entityId}</span>
                  </div>
                  <p className="text-sm text-muted mt-sm">{l.details}</p>
                </div>
                <div style={{textAlign:'right', flexShrink:0}}>
                  <p className="text-sm text-muted">{l.performedBy}</p>
                  <p className="text-sm text-muted">{formatTime(l.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
