/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, Megaphone, Package, Users, Shield, FileText, LogOut } from 'lucide-react'
import Dashboard from './Dashboard'
import CampaignOverview from './CampaignOverview'
import StickerOverview from './StickerOverview'
import RiderOverview from './RiderOverview'
import VerificationQueue from './VerificationQueue'
import AuditLogView from './AuditLogView'

export default function AdminConsole({ user, onLogout }) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h1>ParcelPulse</h1>
          <p>Admin Console</p>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user.name?.charAt(0)}</div>
          <div className="sidebar-user-info">
            <h3>{user.name}</h3>
            <span>Administrator</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">Overview</div>
          <NavLink to="/admin" end><LayoutDashboard size={18} /> Dashboard</NavLink>
          <div className="nav-section">Manage</div>
          <NavLink to="/admin/campaigns"><Megaphone size={18} /> Campaigns</NavLink>
          <NavLink to="/admin/stickers"><Package size={18} /> Stickers</NavLink>
          <NavLink to="/admin/riders"><Users size={18} /> Riders</NavLink>
          <div className="nav-section">Verification</div>
          <NavLink to="/admin/verification"><Shield size={18} /> Review Queue</NavLink>
          <div className="nav-section">System</div>
          <NavLink to="/admin/audit"><FileText size={18} /> Audit Log</NavLink>
        </nav>
        <div className="sidebar-logout">
          <button className="btn btn-secondary btn-sm" style={{width:'100%'}} onClick={onLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="campaigns" element={<CampaignOverview adminId={user.id} />} />
          <Route path="stickers" element={<StickerOverview adminId={user.id} />} />
          <Route path="riders" element={<RiderOverview />} />
          <Route path="verification" element={<VerificationQueue adminId={user.id} />} />
          <Route path="audit" element={<AuditLogView />} />
        </Routes>
      </main>
    </div>
  )
}
