import { Routes, Route, NavLink } from 'react-router-dom'
import { BarChart3, PlusCircle, List, LayoutDashboard, LogOut } from 'lucide-react'
import CampaignList from './CampaignList'
import CreateCampaign from './CreateCampaign'
import CampaignDashboard from './CampaignDashboard'

export default function BusinessPortal({ user, onLogout }) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h1>ParcelPulse</h1>
          <p>Business Portal</p>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user.name?.charAt(0)}</div>
          <div className="sidebar-user-info">
            <h3>{user.name}</h3>
            <span>Advertiser</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">Campaigns</div>
          <NavLink to="/business" end><LayoutDashboard size={18} /> My Campaigns</NavLink>
          <NavLink to="/business/create"><PlusCircle size={18} /> Create Campaign</NavLink>
          <div className="nav-section">Analytics</div>
          <NavLink to="/business/dashboard"><BarChart3 size={18} /> Campaign Results</NavLink>
        </nav>
        <div className="sidebar-logout">
          <button className="btn btn-secondary btn-sm" style={{width:'100%'}} onClick={onLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Routes>
          <Route index element={<CampaignList userId={user.id} />} />
          <Route path="create" element={<CreateCampaign userId={user.id} />} />
          <Route path="dashboard" element={<CampaignDashboard userId={user.id} />} />
          <Route path="dashboard/:id" element={<CampaignDashboard userId={user.id} />} />
        </Routes>
      </main>
    </div>
  )
}
