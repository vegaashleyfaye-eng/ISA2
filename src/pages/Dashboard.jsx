import React, { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SecurityPolicy from '../components/SecurityPolicy'
import PasswordChecker from '../components/PasswordChecker'
import ComplianceChecklist from '../components/ComplianceChecklist'
import SecurityQuiz from '../components/SecurityQuiz'
import SessionManagement from '../components/SessionManagement'
import './Dashboard.css'

const VALID_PAGES = ['policy', 'password', 'checklist', 'quiz', 'sessions']
const SIM_DURATION = 20 * 60 // 20 minutes in seconds

function formatTime(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatElapsed(secs) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Simulation timer
  const isSimMode = searchParams.get('sim') === '1'
  const [timeLeft, setTimeLeft] = useState(SIM_DURATION)
  const [simEnded, setSimEnded] = useState(false)
  const [elapsedOnEnd, setElapsedOnEnd] = useState(0)
  const startTimeRef = useRef(isSimMode ? Date.now() : null)

  // Quiz score tracking
  const [quizScore, setQuizScore] = useState(null)
  const [tasksCompleted, setTasksCompleted] = useState(0)

  const rawPage = searchParams.get('page')
  const currentPage = VALID_PAGES.includes(rawPage) ? rawPage : 'policy'

  const setCurrentPage = (id) => {
    const params = { page: id }
    if (isSimMode) params.sim = '1'
    setSearchParams(params)
    setSidebarOpen(false)
  }

  // Countdown timer
  useEffect(() => {
    if (!isSimMode || simEnded) return
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = Math.max(0, SIM_DURATION - elapsed)
      setTimeLeft(remaining)
      if (remaining === 0) {
        setElapsedOnEnd(elapsed)
        setSimEnded(true)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isSimMode, simEnded])

  const handleEndEarly = () => {
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
    setElapsedOnEnd(elapsed)
    setSimEnded(true)
  }

  const handleReturnToLanding = () => {
    navigate('/')
  }

  const menuItems = [
    { id: 'policy',    label: 'Security Policy' },
    { id: 'password',  label: 'Password Checker' },
    { id: 'checklist', label: 'Compliance Checklist' },
    { id: 'quiz',      label: 'Security Quiz' },
    { id: 'sessions',  label: 'Session Management' },
  ]

  const timerWarning = isSimMode && timeLeft <= 60
  const timerCritical = isSimMode && timeLeft <= 0

  return (
    <div className="dashboard">

      {/* ── Session End Modal ── */}
      {simEnded && (
        <div className="sim-modal-overlay">
          <div className="sim-modal">
            <h2>Simulation Complete</h2>
            <p className="sim-modal-sub">Your 20-minute ISO 27001 session has ended.</p>

            <div className="sim-summary-grid">
              <div className="sim-summary-item">
                <span className="sim-summary-num">{formatElapsed(elapsedOnEnd)}</span>
                <span className="sim-summary-label">Total Session Time</span>
              </div>
              <div className="sim-summary-item">
                <span className="sim-summary-num">4</span>
                <span className="sim-summary-label">Modules Available</span>
              </div>
              {quizScore !== null && (
                <div className="sim-summary-item">
                  <span className="sim-summary-num">{quizScore}%</span>
                  <span className="sim-summary-label">Quiz Score</span>
                </div>
              )}
            </div>

            <button className="sim-modal-btn" onClick={handleReturnToLanding}>
              Return to Landing Page
            </button>
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>ISO 27001 COMPLIANCE DEMO WEBSITE</h1>

        {isSimMode && (
          <>
            <div className="sim-mode-label">Simulation Active</div>
            <div className={`sim-timer ${timerWarning ? 'warning' : ''}`}>
              <span className="sim-timer-label">Session</span>
              <span className="sim-timer-count">{formatTime(timeLeft)}</span>
              <button className="sim-end-btn" onClick={handleEndEarly}>End</button>
            </div>
          </>
        )}
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
          {currentPage === 'quiz'      && <SecurityQuiz onScoreUpdate={setQuizScore} />}
          {currentPage === 'sessions'  && <SessionManagement />}
        </main>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
