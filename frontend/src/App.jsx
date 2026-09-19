import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import BusinessPortal from './features/business/BusinessPortal'
import AgentPortal from './features/agent/AgentPortal'
import RiderApp from './features/rider/RiderApp'
import AdminConsole from './features/admin/AdminConsole'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('pp_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('pp_user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('pp_user')
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    )
  }

  const portalMap = {
    ADVERTISER: '/business/*',
    AGENT: '/agent/*',
    RIDER: '/rider/*',
    ADMIN: '/admin/*'
  }

  return (
    <Routes>
      <Route path="/business/*" element={
        user.role === 'ADVERTISER' ? <BusinessPortal user={user} onLogout={handleLogout} /> : <Navigate to="/" />
      } />
      <Route path="/agent/*" element={
        user.role === 'AGENT' ? <AgentPortal user={user} onLogout={handleLogout} /> : <Navigate to="/" />
      } />
      <Route path="/rider/*" element={
        user.role === 'RIDER' ? <RiderApp user={user} onLogout={handleLogout} /> : <Navigate to="/" />
      } />
      <Route path="/admin/*" element={
        user.role === 'ADMIN' ? <AdminConsole user={user} onLogout={handleLogout} /> : <Navigate to="/" />
      } />
      <Route path="*" element={
        <Navigate to={
          user.role === 'ADVERTISER' ? '/business' :
          user.role === 'AGENT' ? '/agent' :
          user.role === 'RIDER' ? '/rider' :
          '/admin'
        } />
      } />
    </Routes>
  )
}
