import React, { useEffect, useState, useRef } from 'react'
import { RefreshCw, Clock, XCircle, CheckCircle, AlertTriangle, ShieldCheck, ShieldX, Users } from 'lucide-react'
import './SessionManagement.css'

const GEO_MAP = {
  '198.51.100.10': { flag: '🇺🇸', country: 'United States' },
  '203.0.113.22':  { flag: '🇦🇺', country: 'Australia' },
  '198.51.100.45': { flag: '🇵🇭', country: 'Philippines' },
  '10.0.0.99':     { flag: '🏢',  country: 'Internal Network' },
}

function maskIP(ip) {
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.xxx.xxx`
  return ip.replace(/[^:]+$/, 'xxxx')
}

function getGeo(ip) {
  return GEO_MAP[ip] || { flag: '🌐', country: 'Unknown' }
}

const now0 = Date.now()

const sampleSessions = [
  {
    id: 'sess-2001',
    username: 'demo_user_5m',
    loginTime: now0 - 1000 * 60 * 5,
    logoutTime: null,
    device: 'Windows 10 Laptop',
    browser: 'Chrome 114',
    ip: '198.51.100.10',
    status: 'active',
    mfa: true,
    activity: [
      { ts: now0 - 1000 * 60 * 5, event: 'Login success',           status: 'success', risk: 'Low'    },
      { ts: now0 - 1000 * 60 * 2, event: 'Restricted area access',  status: 'success', risk: 'Medium' },
    ],
  },
  {
    id: 'sess-2002',
    username: 'demo_user_23m',
    loginTime: now0 - 1000 * 60 * 23,
    logoutTime: null,
    device: 'macOS MacBook',
    browser: 'Safari 16',
    ip: '203.0.113.22',
    status: 'active',
    mfa: false,
    activity: [
      { ts: now0 - 1000 * 60 * 23, event: 'Login success',         status: 'success', risk: 'Low'  },
      { ts: now0 - 1000 * 60 * 10, event: 'Failed login attempt',  status: 'failed',  risk: 'High' },
    ],
  },
  {
    id: 'sess-2003',
    username: 'demo_user_1h15',
    loginTime: now0 - 1000 * 60 * 75,
    logoutTime: null,
    device: 'Android Phone',
    browser: 'Chrome Mobile',
    ip: '198.51.100.45',
    status: 'active',
    mfa: true,
    activity: [
      { ts: now0 - 1000 * 60 * 75, event: 'Login success',   status: 'success', risk: 'Low'    },
      { ts: now0 - 1000 * 60 * 30, event: 'Password change', status: 'success', risk: 'Medium' },
    ],
  },
  {
    id: 'sess-2004',
    username: 'demo_user_3h42',
    loginTime: now0 - 1000 * 60 * 222,
    logoutTime: now0 - 1000 * 60 * 10,
    device: 'Linux Workstation',
    browser: 'Firefox 102',
    ip: '10.0.0.99',
    status: 'ended',
    mfa: true,
    activity: [
      { ts: now0 - 1000 * 60 * 222, event: 'Login success',          status: 'success', risk: 'Low'  },
      { ts: now0 - 1000 * 60 * 180, event: 'Restricted area access', status: 'success', risk: 'High' },
      { ts: now0 - 1000 * 60 * 10,  event: 'Logout',                 status: 'success', risk: 'Low'  },
    ],
  },
]

const SESSION_TTL_SECONDS = 4 * 60 * 60

function formatDateTime(ts) {
  if (!ts) return '-'
  return new Date(ts).toLocaleString()
}

function formatDuration(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getSessionRisk(session) {
  const hasHigh   = session.activity.some(a => a.risk === 'High')
  const hasMedium = session.activity.some(a => a.risk === 'Medium')
  if (hasHigh)   return 'High'
  if (hasMedium) return 'Medium'
  return 'Low'
}

export default function SessionManagement() {
  const [sessions, setSessions]   = useState(() => sampleSessions)
  const [selected, setSelected]   = useState(null)
  const [now, setNow]             = useState(Date.now())
  const initialRef                = useRef(sampleSessions)

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const computeDuration = (s) => {
    const end  = s.logoutTime || now
    const secs = Math.max(0, Math.floor((end - s.loginTime) / 1000))
    return formatDuration(secs)
  }

  const getComplianceBadge = (s) => {
    if (s.status !== 'active') return { text: 'Session ended',   type: 'expired' }
    const elapsed   = Math.floor((now - s.loginTime) / 1000)
    const remaining = SESSION_TTL_SECONDS - elapsed
    if (remaining <= 0)   return { text: 'Session expired',      type: 'expired' }
    if (remaining <= 300) return { text: 'Near timeout',         type: 'near'    }
    return                       { text: 'Session active',       type: 'active'  }
  }

  const getExpiryPercent = (s) => {
    if (s.status !== 'active') return 0
    const elapsed = Math.floor((now - s.loginTime) / 1000)
    return Math.min(100, Math.round((elapsed / SESSION_TTL_SECONDS) * 100))
  }

  const getRemainingSeconds = (s) => {
    const elapsed = Math.floor((now - s.loginTime) / 1000)
    return Math.max(0, SESSION_TTL_SECONDS - elapsed)
  }

  const refresh = () => {
    setSessions([...initialRef.current])
    setSelected(null)
  }

  const endSession = (id) => {
    const ts = Date.now()
    setSessions(prev => prev.map(s => s.id === id ? { ...s, logoutTime: ts, status: 'ended' } : s))
    setSelected(prev => prev?.id === id ? { ...prev, logoutTime: ts, status: 'ended' } : prev)
  }

  const simulateTimeout = (id) => {
    const ts = Date.now()
    setSessions(prev => prev.map(s => s.id === id ? { ...s, logoutTime: ts, status: 'timed_out' } : s))
    setSelected(prev => prev?.id === id ? { ...prev, logoutTime: ts, status: 'timed_out' } : prev)
  }

  const simulateConcurrentLogin = (id) => {
    const orig = sessions.find(s => s.id === id)
    if (!orig) return
    const newSess = {
      id:          `sess-${Date.now()}`,
      username:    orig.username,
      loginTime:   Date.now(),
      logoutTime:  null,
      device:      orig.device,
      browser:     orig.browser,
      ip:          orig.ip,
      status:      'active',
      mfa:         false,
      activity: [
        { ts: Date.now(), event: 'Concurrent login detected', status: 'success', risk: 'High' },
      ],
    }
    setSessions(prev => [newSess, ...prev])
    setSelected(newSess)
  }

  const badge = selected ? getComplianceBadge(selected) : null

  return (
    <div className="session-management">

      <div className="sessions-list">
        <div className="sessions-header">
          <h3>Active sessions</h3>
          <button className="btn" onClick={refresh}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <ul>
          {sessions.map(s => {
            const geo = getGeo(s.ip)
            return (
              <li
                key={s.id}
                className={`session-item status-${s.status}${selected?.id === s.id ? ' selected' : ''}`}
                onClick={() => setSelected(s)}
              >
                <div className="si-left">
                  <div className="si-id">{s.id}</div>
                  <div className="si-user">{s.username}</div>
                  <div className="si-geo">{geo.flag} {geo.country}</div>
                </div>
                <div className="si-right">
                  <span className={`status-badge sb-${s.status}`}>{s.status}</span>
                  <div className="si-duration">{computeDuration(s)}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="session-details">
        {selected ? (
          <div className="details-card">

            <div className="details-header">
              <h3>Session details</h3>
              <div className="header-meta">
                <span className={`compliance-badge cb-${badge.type}`}>
                  {badge.type === 'active' && <CheckCircle   size={13} />}
                  {badge.type === 'near'   && <AlertTriangle size={13} />}
                  {badge.type === 'expired'&& <XCircle       size={13} />}
                  {badge.text}
                </span>
                {selected.mfa
                  ? <span className="mfa-badge"><ShieldCheck size={13} /> MFA verified</span>
                  : <span className="mfa-badge no-mfa"><ShieldX size={13} /> No MFA</span>
                }
                <button className="btn-close" onClick={() => setSelected(null)}>
                  <XCircle size={17} />
                </button>
              </div>
            </div>

            <div className="detail-body">
              <div className="detail-row"><strong>Session ID</strong>      <span className="mono">{selected.id}</span></div>
              <div className="detail-row"><strong>Username</strong>        <span>{selected.username}</span></div>
              <div className="detail-row"><strong>Login time</strong>      <span>{formatDateTime(selected.loginTime)}</span></div>
              <div className="detail-row"><strong>Session duration</strong><span className="mono">{computeDuration(selected)}</span></div>
              <div className="detail-row"><strong>Logout time</strong>     <span>{selected.logoutTime ? formatDateTime(selected.logoutTime) : '-'}</span></div>
              <div className="detail-row"><strong>IP address</strong>      <span className="mono masked-ip">{maskIP(selected.ip)}</span></div>
              <div className="detail-row"><strong>Location</strong>
                <span>{getGeo(selected.ip).flag} {getGeo(selected.ip).country}</span>
              </div>
              <div className="detail-row"><strong>Device</strong>          <span>{selected.device}</span></div>
              <div className="detail-row"><strong>Browser</strong>         <span>{selected.browser}</span></div>
              <div className="detail-row"><strong>Session status</strong>
                <span className={`status-badge sb-${selected.status}`}>{selected.status}</span>
              </div>
              <div className="detail-row"><strong>Risk score</strong>
                <span className={`risk-pill risk-${getSessionRisk(selected).toLowerCase()}`}>
                  {getSessionRisk(selected)}
                </span>
              </div>
            </div>

            {selected.status === 'active' && (
              <div className="expiry-bar-wrap">
                <div className="expiry-label">
                  <span><Clock size={11} style={{ verticalAlign: '-1px', marginRight: 4 }} />Session expiry</span>
                  <span>{formatDuration(getRemainingSeconds(selected))} remaining</span>
                </div>
                <div className="expiry-bar">
                  <div
                    className="expiry-fill"
                    style={{
                      width: `${getExpiryPercent(selected)}%`,
                      background: getExpiryPercent(selected) >= 90
                        ? '#E24B4A'
                        : getExpiryPercent(selected) >= 70
                          ? '#EF9F27'
                          : '#1D9E75',
                    }}
                  />
                </div>
              </div>
            )}

            <div className="activity-log">
              <h4>Activity log</h4>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.activity || []).map((ev, i) => (
                    <tr key={i}>
                      <td>{formatDateTime(ev.ts)}</td>
                      <td>{ev.event}</td>
                      <td>{ev.status}</td>
                      <td>
                        <span className={`risk-pill risk-${ev.risk.toLowerCase()}`}>{ev.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="controls">
              {selected.status === 'active' && (
                <>
                  <button className="btn danger" onClick={() => endSession(selected.id)}>
                    End session
                  </button>
                  <button className="btn warn" onClick={() => simulateTimeout(selected.id)}>
                    Simulate timeout
                  </button>
                </>
              )}
              <button className="btn" onClick={() => simulateConcurrentLogin(selected.id)}>
                <Users size={13} /> Simulate concurrent login
              </button>
            </div>

            <div className="compliance-section">
              <h4>ISO 27001 compliance mapping</h4>
              <ul>
                <li><strong>A.9.4 — Access control:</strong> Full IP is masked to protect user privacy; origin is traceable only by authorized personnel.</li>
                <li><strong>A.9.1 — MFA enforcement:</strong> Multi-factor authentication status is verified and flagged per session.</li>
                <li><strong>A.12.4 — Audit logging:</strong> All events, timestamps, and risk levels are captured for accountability and review.</li>
                <li><strong>A.12.6 — Risk scoring:</strong> Session risk is computed from activity anomalies and surfaced to reviewers in real time.</li>
                <li><strong>A.9.4.2 — Session timeout:</strong> Sessions are tracked against a 4-hour TTL with visual countdown and forced expiry controls.</li>
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