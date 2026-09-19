import { useState, useEffect } from 'react'
import { getAgentAvailableStickers, getUsersByRole, assignStickersToRider } from '../../api/client'
import { Send } from 'lucide-react'

export default function AssignStickers({ agentId }) {
  const [stickers, setStickers] = useState([])
  const [riders, setRiders] = useState([])
  const [selectedRider, setSelectedRider] = useState('')
  const [selectedStickers, setSelectedStickers] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getAgentAvailableStickers(agentId).then(res => setStickers(res.data))
    getUsersByRole('RIDER').then(res => setRiders(res.data))
  }, [agentId])

  const toggleSticker = (id) => {
    setSelectedStickers(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const selectAll = () => {
    setSelectedStickers(selectedStickers.length === stickers.length ? [] : stickers.map(s => s.id))
  }

  const handleAssign = async () => {
    if (!selectedRider || selectedStickers.length === 0) {
      setMsg('Select a rider and at least one sticker')
      return
    }
    setLoading(true)
    setMsg('')
    try {
      await assignStickersToRider({ agentId, riderId: Number(selectedRider), stickerIds: selectedStickers })
      setMsg(`✅ ${selectedStickers.length} stickers assigned successfully!`)
      setSelectedStickers([])
      getAgentAvailableStickers(agentId).then(res => setStickers(res.data))
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Failed'))
    } finally { setLoading(false) }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Assign Stickers to Riders</h1>
        <p>Select stickers and assign them to delivery riders</p>
      </div>

      {msg && <div className="card mb-md" style={{ background: msg.startsWith('✅') ? '#e8faf0' : '#fde8e8' }}>
        <p>{msg}</p>
      </div>}

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Select Rider</h3>
          </div>
          <select className="form-control" value={selectedRider} onChange={e => setSelectedRider(e.target.value)}>
            <option value="">Choose a rider...</option>
            {riders.map(r => <option key={r.id} value={r.id}>{r.name} ({r.email})</option>)}
          </select>

          <div className="mt-lg">
            <div className="flex-between mb-md">
              <h3>Available Stickers ({stickers.length})</h3>
              <button className="btn btn-secondary btn-sm" onClick={selectAll}>
                {selectedStickers.length === stickers.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {stickers.length === 0 ? (
              <p className="text-muted text-sm">No available stickers to assign</p>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {stickers.map(s => (
                  <label key={s.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                    background: selectedStickers.includes(s.id) ? '#fff0e6' : 'var(--bg-primary)',
                    border: `1px solid ${selectedStickers.includes(s.id) ? 'var(--accent-primary)' : 'var(--border-color)'}`
                  }}>
                    <input type="checkbox" checked={selectedStickers.includes(s.id)} onChange={() => toggleSticker(s.id)} />
                    <span className="font-mono text-sm">{s.stickerCode}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: '32px', alignSelf: 'start' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>Assignment Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="flex-between">
              <span className="text-muted">Selected Rider</span>
              <strong>{selectedRider ? riders.find(r => r.id == selectedRider)?.name : '—'}</strong>
            </div>
            <div className="flex-between">
              <span className="text-muted">Stickers Selected</span>
              <strong>{selectedStickers.length}</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <button className="btn btn-primary btn-lg" onClick={handleAssign}
              disabled={loading || !selectedRider || selectedStickers.length === 0} style={{ width: '100%' }}>
              <Send size={18} /> {loading ? 'Assigning...' : `Assign ${selectedStickers.length} Sticker${selectedStickers.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
