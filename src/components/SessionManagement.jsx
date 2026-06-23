import React, { useEffect, useState, useRef } from 'react'
import { RefreshCw, Clock, XCircle, CheckCircle, AlertTriangle } from 'lucide-react'
import './SessionManagement.css'

// Demo sessions with a variety of durations (mock data only)
const sampleSessions = [
  // 5 minutes
  {
    id: 'sess-2001',
    username: 'demo_user_5m',
    loginTime: Date.now() - (1000 * 60 * 5),
    logoutTime: null,
    device: 'Windows 10 Laptop',
    browser: 'Chrome 114',
    ip: '198.51.100.10',
    status: 'active',
    activity: [
      { ts: Date.now() - (1000 * 60 * 5), event: 'Login Success', status: 'success', risk: 'Low' },
      { ts: Date.now() - (1000 * 60 * 2), event: 'Access to Restricted Area', status: 'success', risk: 'Medium' }
    ]
  },
  // 23 minutes
  {
    id: 'sess-2002',
    username: 'demo_user_23m',
    loginTime: Date.now() - (1000 * 60 * 23),
    logoutTime: null,
    device: 'macOS MacBook',
    browser: 'Safari 16',
    ip: '203.0.113.22',
    status: 'active',
    activity: [
      { ts: Date.now() - (1000 * 60 * 23), event: 'Login Success', status: 'success', risk: 'Low' },
      { ts: Date.now() - (1000 * 60 * 10), event: 'Failed Login Attempt', status: 'failed', risk: 'High' }
    ]
  },
  // 1 hour 15 minutes
  {
    id: 'sess-2003',
    username: 'demo_user_1h15',
    loginTime: Date.now() - (1000 * 60 * (60 + 15)),
    logoutTime: null,
    device: 'Android Phone',
    browser: 'Chrome Mobile',
    ip: '198.51.100.45',
    status: 'active',
    activity: [
      { ts: Date.now() - (1000 * 60 * (60 + 15)), event: 'Login Success', status: 'success', risk: 'Low' },
      { ts: Date.now() - (1000 * 60 * 30), event: 'Password Change', status: 'success', risk: 'Medium' }
    ]
  },
  // 3 hours 42 minutes (long session)
  {
    id: 'sess-2004',
    username: 'demo_user_3h42',
    loginTime: Date.now() - (1000 * 60 * (3 * 60 + 42)),
    logoutTime: Date.now() - (1000 * 60 * 10),
    device: 'Linux Workstation',
    browser: 'Firefox 102',
    ip: '10.0.0.99',
    status: 'ended',
    activity: [
      { ts: Date.now() - (1000 * 60 * (3 * 60 + 42)), event: 'Login Success', status: 'success', risk: 'Low' },
      { ts: Date.now() - (1000 * 60 * 180), event: 'Access to Restricted Area', status: 'success', risk: 'High' },
      { ts: Date.now() - (1000 * 60 * 10), event: 'Logout', status: 'success', risk: 'Low' }
    ]
  }
]

function formatDateTime(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  return d.toLocaleString()
}

function formatDuration(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

export default function SessionManagement() {
  const [sessions, setSessions] = useState(() => sampleSessions)
  const [selected, setSelected] = useState(null)
  const [now, setNow] = useState(Date.now())
  const initialRef = useRef(sampleSessions)

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const selectSession = (sess) => {
    setSelected(sess)
  }

  const refresh = () => {
    // in demo just reset to initial (preserves any live timers)
    setSessions([...initialRef.current])
    setSelected(null)
  }

  const endSession = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, logoutTime: Date.now(), status: 'ended' } : s))
    if (selected?.id === id) setSelected(prev => ({ ...prev, logoutTime: Date.now(), status: 'ended' }))
  }

  const simulateTimeout = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, logoutTime: Date.now(), status: 'timed_out' } : s))
    if (selected?.id === id) setSelected(prev => ({ ...prev, logoutTime: Date.now(), status: 'timed_out' }))
  }

  const simulateConcurrentLogin = (id) => {
    const orig = sessions.find(s => s.id === id)
    if (!orig) return
    const newSess = {
      id: `sess-${Date.now()}`,
      username: orig.username,
      loginTime: Date.now(),
      logoutTime: null,
      device: orig.device,
      browser: orig.browser,
      ip: orig.ip,
      status: 'active'
    }
    setSessions(prev => [newSess, ...prev])
    setSelected(newSess)
  }

  const computeDuration = (s) => {
    const start = s.loginTime
    const end = s.logoutTime || now
    const secs = Math.max(0, Math.floor((end - start) / 1000))
    return formatDuration(secs)
  }

  const SESSION_TTL_SECONDS = 4 * 60 * 60 // 4 hours for demo

  const getComplianceBadge = (s) => {
    if (s.status !== 'active') return { text: 'Session Expired', type: 'expired' }
    const elapsed = Math.floor((now - s.loginTime) / 1000)
    const remaining = SESSION_TTL_SECONDS - elapsed
    if (remaining <= 0) return { text: 'Session Expired', type: 'expired' }
    if (remaining <= 300) return { text: 'Session Near Timeout', type: 'near' }
    return { text: 'Session Active', type: 'active' }
  }

  return (
    <div className="session-management">
      <div className="sessions-list">
        <div className="sessions-header">
          <h3>Active Sessions</h3>
          <div className="sessions-actions">
            <button className="btn" onClick={refresh}><RefreshCw size={14} /> Refresh Sessions</button>
          </div>
        </div>

        <ul>
          {sessions.map(s => (
            <li key={s.id} className={`session-item ${s.status}`} onClick={() => selectSession(s)}>
              <div className="left">
                <div className="sid">{s.id}</div>
                <div className="user">{s.username}</div>
              </div>
              <div className="mid">
                <div className="device">{s.device}</div>
                <div className="meta">{s.browser} • {s.ip}</div>
              </div>
              <div className="right">
                <div className="status">{s.status}</div>
                <div className="duration">{computeDuration(s)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="session-details">
        {selected ? (
          <div className="details-card">
            <div className="details-header">
              <h3>Session Details</h3>
              <div className="header-meta">
                <div className="badge">
                  {getComplianceBadge(selected).type === 'active' && <CheckCircle size={16} />}
                  {getComplianceBadge(selected).type === 'near' && <AlertTriangle size={16} />}
                  {getComplianceBadge(selected).type === 'expired' && <XCircle size={16} />}
                  <span>{getComplianceBadge(selected).text}</span>
                </div>
                <button className="btn-close" onClick={() => setSelected(null)}><XCircle size={18} /></button>
              </div>
            </div>

            <div className="detail-row"><strong>Session ID:</strong> <span>{selected.id}</span></div>
            <div className="detail-row"><strong>User Name:</strong> <span>{selected.username}</span></div>
            <div className="detail-row"><strong>Login Time:</strong> <span>{formatDateTime(selected.loginTime)}</span></div>
            <div className="detail-row"><strong>Logged In For:</strong> <span>{computeDuration(selected)}</span></div>
            <div className="detail-row"><strong>Logout Time:</strong> <span>{selected.logoutTime ? formatDateTime(selected.logoutTime) : '-'}</span></div>
            <div className="detail-row"><strong>Device Information:</strong> <span>{selected.device}</span></div>
            <div className="detail-row"><strong>Browser Information:</strong> <span>{selected.browser}</span></div>
            <div className="detail-row"><strong>IP Address:</strong> <span>{selected.ip}</span></div>
            <div className="detail-row"><strong>Session Status:</strong> <span>{selected.status}</span></div>

            <div className="activity-log">
              <h4>Activity Log</h4>
              <table>
                <thead>
                  <tr><th>Timestamp</th><th>Event</th><th>Status</th><th>Risk</th></tr>
                </thead>
                <tbody>
                  {(selected.activity || []).map((ev, i) => (
                    <tr key={i}>
                      <td>{formatDateTime(ev.ts)}</td>
                      <td>{ev.event}</td>
                      <td>{ev.status}</td>
                      <td>{ev.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="controls">
              {selected.status === 'active' && (
                <><button className="btn danger" onClick={() => endSession(selected.id)}>End Session</button>
                <button className="btn warn" onClick={() => simulateTimeout(selected.id)}>Simulate Session Timeout</button></>
              )}
              <button className="btn" onClick={() => simulateConcurrentLogin(selected.id)}>Simulate Concurrent Login</button>
            </div>

            <div className="compliance-section">
              <h4>ISO 27001 Compliance Mapping</h4>
              <ul>
                <li><strong>Access Control:</strong> Session tracking enforces authorized access and records activity.</li>
                <li><strong>User Accountability:</strong> User identity is linked to session events for auditability.</li>
                <li><strong>Audit Logging:</strong> Activity log captures events, timestamps and risk levels.</li>
                <li><strong>Session Monitoring:</strong> Live timers and status indicators support monitoring.</li>
                <li><strong>Security Event Detection:</strong> Failed attempts and anomalies are surfaced for review.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="details-empty">Select a session to view details</div>
        )}
      </div>
    </div>
  )
}
