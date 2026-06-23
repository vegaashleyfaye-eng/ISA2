import React, { useState, useEffect, useRef } from 'react'
import { Lock, LogIn, LogOut } from 'lucide-react'
import './Session.css'

export default function Session() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [expiresAt, setExpiresAt] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef(null)

  const SESSION_MS = 15 * 60 * 1000 // 15 minutes

  const login = (e) => {
    e.preventDefault()
    // Minimal demo logic: accept any non-empty credentials
    if (!username.trim() || !password) return
    const expiry = Date.now() + SESSION_MS
    setExpiresAt(expiry)
    setLoggedIn(true)
    setTimeLeft(Math.max(0, Math.ceil((expiry - Date.now()) / 1000)))
  }

  const logout = () => {
    setLoggedIn(false)
    setExpiresAt(null)
    setTimeLeft(0)
  }

  useEffect(() => {
    if (loggedIn && expiresAt) {
      // start countdown timer
      timerRef.current = setInterval(() => {
        const secs = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
        setTimeLeft(secs)
        if (secs <= 0) {
          clearInterval(timerRef.current)
          logout()
        }
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, expiresAt])

  const formattedTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="session-card">
      <div className="session-header">
        <Lock size={18} />
        <h3>Login Session</h3>
      </div>

      {!loggedIn ? (
        <form className="session-form" onSubmit={login}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button className="btn-login" type="submit">
            <LogIn size={16} />
            <span>Log in</span>
          </button>
        </form>
      ) : (
        <div className="session-active">
          <div className="session-info">
            <div className="session-user">Signed in as <strong>{username}</strong></div>
            <div className="session-expires">Expires in: <strong>{formattedTime(timeLeft)}</strong></div>
          </div>
          <div className="session-actions">
            <button className="btn-logout" onClick={logout}>
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
