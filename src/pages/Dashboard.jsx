import React, { useState } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import SecurityPolicy from '../components/SecurityPolicy'
import PasswordChecker from '../components/PasswordChecker'
import ComplianceChecklist from '../components/ComplianceChecklist'
import SecurityQuiz from '../components/SecurityQuiz'
import './Dashboard.css'

export default function Dashboard({ user, onLogout, currentPage, setCurrentPage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: 'policy', label: 'Security Policy' },
    { id: 'password', label: 'Password Checker' },
    { id: 'checklist', label: 'Compliance Checklist' },
    { id: 'quiz', label: 'Security Quiz' }
  ]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>ISO 27001 Compliance Dashboard</h1>
        <div className="user-info">
          <span>{user?.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="nav-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(item.id)
                  setSidebarOpen(false)
                }}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="session-info">
            <p><strong>User:</strong> {user?.email}</p>
            <p><strong>Login:</strong> {user?.loginTime}</p>
            <p><strong>MFA:</strong> {user?.mfaEnabled ? '✓ Enabled' : '✗ Disabled'}</p>
          </div>
        </aside>

        <main className="dashboard-content">
          {currentPage === 'policy' && <SecurityPolicy />}
          {currentPage === 'password' && <PasswordChecker />}
          {currentPage === 'checklist' && <ComplianceChecklist />}
          {currentPage === 'quiz' && <SecurityQuiz />}
        </main>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
