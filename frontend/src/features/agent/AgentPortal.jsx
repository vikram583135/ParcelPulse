/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { Routes, Route, NavLink } from 'react-router-dom'
import { Package, Users, ClipboardList, LogOut } from 'lucide-react'
import Inventory from './Inventory'
import AssignStickers from './AssignStickers'

export default function AgentPortal({ user, onLogout }) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h1>ParcelPulse</h1>
          <p>Agent Portal</p>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user.name?.charAt(0)}</div>
          <div className="sidebar-user-info">
            <h3>{user.name}</h3>
            <span>Agent</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">Inventory</div>
          <NavLink to="/agent" end><Package size={18} /> My Stickers</NavLink>
          <div className="nav-section">Distribute</div>
          <NavLink to="/agent/assign"><Users size={18} /> Assign to Riders</NavLink>
        </nav>
        <div className="sidebar-logout">
          <button className="btn btn-secondary btn-sm" style={{width:'100%'}} onClick={onLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Routes>
          <Route index element={<Inventory agentId={user.id} />} />
          <Route path="assign" element={<AssignStickers agentId={user.id} />} />
        </Routes>
      </main>
    </div>
  )
}
