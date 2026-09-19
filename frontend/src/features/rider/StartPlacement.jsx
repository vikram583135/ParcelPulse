import { useState, useEffect } from 'react'
import { getRiderAvailableStickers, startPlacement, endPlacement } from '../../api/client'
import { Camera, MapPin, Upload, CheckCircle } from 'lucide-react'

export default function StartPlacement({ riderId }) {
  const [stickers, setStickers] = useState([])
  const [selectedSticker, setSelectedSticker] = useState('')
  const [phase, setPhase] = useState('select') // select, start, delivering, end, done
  const [startPhoto, setStartPhoto] = useState(null)
  const [startPreview, setStartPreview] = useState(null)
  const [endPhoto, setEndPhoto] = useState(null)
  const [endPreview, setEndPreview] = useState(null)
  const [location, setLocation] = useState({ lat: 12.9716, lng: 77.5946 }) // Bangalore default
  const [placementId, setPlacementId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [useGps, setUseGps] = useState(true)

  useEffect(() => {
    getRiderAvailableStickers(riderId).then(res => setStickers(res.data))
  }, [riderId])

  const getLocation = () => {
    if (navigator.geolocation && useGps) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Using default location')
      )
    }
  }

  useEffect(() => { getLocation() }, [useGps])

  const handleStartPhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setStartPhoto(file)
      setStartPreview(URL.createObjectURL(file))
    }
  }

  const handleEndPhoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEndPhoto(file)
      setEndPreview(URL.createObjectURL(file))
    }
  }

  const handleStart = async () => {
    if (!selectedSticker || !startPhoto) { setMsg('Select a sticker and take a photo'); return }
    setLoading(true)
    setMsg('')
    try {
      getLocation()
      const formData = new FormData()
      formData.append('stickerId', selectedSticker)
      formData.append('riderId', riderId)
      formData.append('photo', startPhoto)
      formData.append('latitude', location.lat)
      formData.append('longitude', location.lng)
      const res = await startPlacement(formData)
      setPlacementId(res.data.id)
      setPhase('delivering')
      setMsg('✅ Start evidence recorded! Continue your delivery...')
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Failed'))
    } finally { setLoading(false) }
  }

  const handleEnd = async () => {
    if (!endPhoto) { setMsg('Take the end photo'); return }
    setLoading(true)
    setMsg('')
    try {
      getLocation()
      const formData = new FormData()
      formData.append('photo', endPhoto)
      formData.append('latitude', location.lat + (Math.random() * 0.03))
      formData.append('longitude', location.lng + (Math.random() * 0.03))
      await endPlacement(placementId, formData)
      setPhase('done')
      setMsg('✅ Placement submitted for verification!')
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.error || 'Failed'))
    } finally { setLoading(false) }
  }

  const reset = () => {
    setPhase('select')
    setSelectedSticker('')
    setStartPhoto(null)
    setStartPreview(null)
    setEndPhoto(null)
    setEndPreview(null)
    setPlacementId(null)
    setMsg('')
    getRiderAvailableStickers(riderId).then(res => setStickers(res.data))
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>New Placement</h1>
        <p>Attach sticker → START photo → Deliver → END photo → Submit</p>
      </div>

      {msg && <div className="card mb-md" style={{ background: msg.startsWith('✅') ? '#e8faf0' : '#fde8e8' }}>
        <p>{msg}</p>
      </div>}

      {/* Progress Steps */}
      <div className="card mb-md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {['Select Sticker', 'Start Photo', 'Deliver', 'End Photo', 'Done'].map((step, i) => {
          const phases = ['select', 'start', 'delivering', 'end', 'done']
          const current = phases.indexOf(phase)
          const isActive = i <= current
          return (
            <div key={step} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', margin: '0 auto 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive ? 'var(--gradient-primary)' : 'var(--border-color)',
                color: isActive ? 'white' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem'
              }}>{i < current ? '✓' : i + 1}</div>
              <span style={{ fontSize: '0.75rem', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: isActive ? 600 : 400 }}>{step}</span>
            </div>
          )
        })}
      </div>

      {/* Phase: Select Sticker */}
      {phase === 'select' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>1. Select Sticker</h3>
            <select className="form-control" value={selectedSticker} onChange={e => { setSelectedSticker(e.target.value); setPhase('start') }}>
              <option value="">Choose a sticker...</option>
              {stickers.map(s => <option key={s.id} value={s.id}>{s.stickerCode} (Campaign #{s.campaignId})</option>)}
            </select>
            {stickers.length === 0 && <p className="text-muted text-sm mt-sm">No stickers available</p>}
          </div>
          <div className="card" style={{ background: 'var(--bg-elevated)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>How it works</h3>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>Select the sticker you're using</li>
              <li>Attach it to the delivery package</li>
              <li>Take a START photo showing the sticker</li>
              <li>Continue your normal delivery</li>
              <li>Take an END photo before handing over</li>
              <li>Submit and earn ₹10!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Phase: Start Photo */}
      {phase === 'start' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>2. Take START Photo</h3>
            <p className="text-sm text-muted mb-md">Photograph the package with the sticker attached</p>
            <label className={`photo-upload ${startPreview ? 'has-photo' : ''}`}>
              {startPreview ? <img src={startPreview} alt="Start" /> : (
                <><Camera size={48} color="var(--text-muted)" /><p className="text-muted mt-sm">Tap to take photo</p></>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={handleStartPhoto} style={{ display: 'none' }} />
            </label>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>📍 Location</h3>
            <div className="flex-between mb-md">
              <span className="text-sm">Use GPS</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={useGps} onChange={e => setUseGps(e.target.checked)} /> {useGps ? 'On' : 'Simulated'}
              </label>
            </div>
            <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div className="flex gap-sm" style={{ alignItems: 'center' }}><MapPin size={16} /> Lat: {location.lat.toFixed(4)}</div>
              <div className="flex gap-sm mt-sm" style={{ alignItems: 'center' }}><MapPin size={16} /> Lng: {location.lng.toFixed(4)}</div>
            </div>
            <button className="btn btn-primary btn-lg mt-lg" onClick={handleStart}
              disabled={loading || !startPhoto} style={{ width: '100%' }}>
              <Upload size={18} /> {loading ? 'Recording...' : 'Record Start Evidence'}
            </button>
          </div>
        </div>
      )}

      {/* Phase: Delivering */}
      {phase === 'delivering' && (
        <div className="card text-center" style={{ padding: '48px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚴</div>
          <h2 style={{ fontFamily: 'var(--font-heading)' }}>Delivering...</h2>
          <p className="text-muted mt-sm">Continue your normal delivery. When you reach the customer, take the END photo.</p>
          <button className="btn btn-primary btn-lg mt-lg" onClick={() => setPhase('end')}>
            <Camera size={18} /> I've reached the customer
          </button>
        </div>
      )}

      {/* Phase: End Photo */}
      {phase === 'end' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>4. Take END Photo</h3>
            <p className="text-sm text-muted mb-md">Show the sticker is still on the package before handing it over</p>
            <label className={`photo-upload ${endPreview ? 'has-photo' : ''}`}>
              {endPreview ? <img src={endPreview} alt="End" /> : (
                <><Camera size={48} color="var(--text-muted)" /><p className="text-muted mt-sm">Tap to take photo</p></>
              )}
              <input type="file" accept="image/*" capture="environment" onChange={handleEndPhoto} style={{ display: 'none' }} />
            </label>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>Submit Placement</h3>
            <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div>Sticker: <strong className="font-mono">{stickers.find(s => s.id == selectedSticker)?.stickerCode}</strong></div>
              <div className="mt-sm">Placement ID: <strong>#{placementId}</strong></div>
            </div>
            <button className="btn btn-success btn-lg" onClick={handleEnd}
              disabled={loading || !endPhoto} style={{ width: '100%' }}>
              <CheckCircle size={18} /> {loading ? 'Submitting...' : 'Submit End Evidence'}
            </button>
          </div>
        </div>
      )}

      {/* Phase: Done */}
      {phase === 'done' && (
        <div className="card text-center" style={{ padding: '48px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px',
            background: 'var(--gradient-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={40} color="white" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent-success)' }}>Placement Submitted!</h2>
          <p className="text-muted mt-sm">Your placement has been submitted for verification. You'll earn ₹10 once verified.</p>
          <button className="btn btn-primary btn-lg mt-lg" onClick={reset}>Start Another Placement</button>
        </div>
      )}
    </div>
  )
}
