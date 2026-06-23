import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import SecurityPolicy from '../components/SecurityPolicy'
import PasswordChecker from '../components/PasswordChecker'
import ComplianceChecklist from '../components/ComplianceChecklist'
import SecurityQuiz from '../components/SecurityQuiz'
import SessionManagement from '../components/SessionManagement'
import './Dashboard.css'

const VALID_PAGES = ['policy', 'password', 'checklist', 'quiz', 'sessions']

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const rawPage = searchParams.get('page')
  const currentPage = VALID_PAGES.includes(rawPage) ? rawPage : 'policy'

  const setCurrentPage = (id) => {
    setSearchParams({ page: id })
    setSidebarOpen(false)
  }

  const menuItems = [
    { id: 'policy',    label: 'Security Policy' },
    { id: 'password',  label: 'Password Checker' },
    { id: 'checklist', label: 'Compliance Checklist' },
    { id: 'quiz',      label: 'Security Quiz' },
    { id: 'sessions',  label: 'Session Management' },
  ]

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>ISO 27001 Compliance Dashboard</h1>
      </header>

      <div className="dashboard-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="nav-menu">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="dashboard-content">
          {currentPage === 'policy'    && <SecurityPolicy />}
          {currentPage === 'password'  && <PasswordChecker />}
          {currentPage === 'checklist' && <ComplianceChecklist />}
          {currentPage === 'quiz'      && <SecurityQuiz />}
          {currentPage === 'sessions'  && <SessionManagement />}
        </main>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
