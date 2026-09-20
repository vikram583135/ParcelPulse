/*
 * Copyright (c) 2026 ParcelPulse. All Rights Reserved.
 * PROPRIETARY AND CONFIDENTIAL. Unauthorized copying, modification,
 * distribution, or use of this software is strictly prohibited.
 * See LICENSE file for details.
 */
import { Routes, Route, NavLink } from 'react-router-dom'
import { Package, Camera, List, Wallet, LogOut } from 'lucide-react'
import MyStickers from './MyStickers'
import StartPlacement from './StartPlacement'
import MyPlacements from './MyPlacements'
import MyRewards from './MyRewards'

export default function RiderApp({ user, onLogout }) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h1>ParcelPulse</h1>
          <p>Rider App</p>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user.name?.charAt(0)}</div>
          <div className="sidebar-user-info">
            <h3>{user.name}</h3>
            <span>Delivery Rider</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">Stickers</div>
          <NavLink to="/rider" end><Package size={18} /> My Stickers</NavLink>
          <div className="nav-section">Placements</div>
          <NavLink to="/rider/place"><Camera size={18} /> New Placement</NavLink>
          <NavLink to="/rider/history"><List size={18} /> My Placements</NavLink>
          <div className="nav-section">Earnings</div>
          <NavLink to="/rider/rewards"><Wallet size={18} /> My Rewards</NavLink>
        </nav>
        <div className="sidebar-logout">
          <button className="btn btn-secondary btn-sm" style={{width:'100%'}} onClick={onLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="app-main">
        <Routes>
          <Route index element={<MyStickers riderId={user.id} />} />
          <Route path="place" element={<StartPlacement riderId={user.id} />} />
          <Route path="history" element={<MyPlacements riderId={user.id} />} />
          <Route path="rewards" element={<MyRewards riderId={user.id} />} />
        </Routes>
      </main>
    </div>
  )
}
