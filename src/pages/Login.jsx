import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, CheckCircle, XCircle, Clock, RefreshCw, Shield, Key, Mail, Smartphone } from 'lucide-react'
import './Login.css'

const API = 'http://localhost:3001'
const maskEmail = (e) => {
  if (!e?.includes('@')) return e
  const [l, d] = e.split('@')
  return `${l.slice(0,2)}${'*'.repeat(Math.max(3,l.length-2))}@${d}`
}
const FACTORS = [
  { cls:'know', label:'Know', eg:'Something you know — e.g. password' },
  { cls:'have', label:'Have', eg:'Something you have — e.g. OTP code' },
]
const STEPS = ['Enter email & password','Receive OTP in your inbox','Enter OTP to verify']
const STEP_KEYS = ['signin','mfa','success']

export default function Login({ onLogin }) {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [mfaCode, setMfaCode]     = useState('')
  const [step, setStep]           = useState('signin')
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [auditLog, setAuditLog]   = useState([])
  const [logError, setLogError]   = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)

  const fetchLog = useCallback(async () => {
    setLogError(false)
    try {
      const res = await fetch(`${API}/api/audit-log`)
      if (!res.ok) throw new Error()
      setAuditLog(await res.json())
    } catch { setLogError(true) }
    finally { setFirstLoad(false) }
  }, [])

  useEffect(() => {
    fetchLog()
    const t = setInterval(fetchLog, 5000)
    return () => clearInterval(t)
  }, [fetchLog])

  const post = (url, body) => fetch(`${API}${url}`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
  })

  const handleSignIn = async (e) => {
    e.preventDefault(); setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Invalid email format')
    if (!(password.length>=12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)))
      return setError('12+ chars, 1 uppercase, 1 number, 1 symbol required')
    setLoading(true)
    try {
      const res = await post('/api/send-otp', { email })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to send OTP'); fetchLog(); return }
      fetchLog(); setStep('mfa')
    } catch { setError('Could not reach the server.') }
    finally { setLoading(false) }
  }

  const handleVerify = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await post('/api/verify-otp', { email, code: mfaCode })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid code'); fetchLog(); return }
      fetchLog(); setStep('success')
      setTimeout(() => onLogin({ email, name: email.split('@')[0], mfaEnabled: true }), 800)
    } catch { setError('Could not reach the server.') }
    finally { setLoading(false) }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── Sidebar ── */}
        <aside className="login-sidebar">
          <div className="ls-brand">
            <Shield size={20} />
            <div>
              <div className="ls-brand-title">ISO 27001 Compliance</div>
              <div className="ls-brand-sub">Secure Authentication — Annex A.8.5</div>
            </div>
          </div>

          <div className="ls-section">
            <div className="ls-heading">What Is MFA?</div>
            <p className="ls-body">Multi-Factor Authentication requires two or more independent factors to verify identity. Stealing a password alone is not enough to gain access.</p>
          </div>
          <div className="ls-divider" />

          <div className="ls-section">
            <div className="ls-heading">Factors Used in This Login</div>
            {FACTORS.map(f => (
              <div key={f.cls} className="ls-factor">
                <span className={`ls-badge ${f.cls}`}>{f.label}</span>
                <span className="ls-factor-text"><em>{f.eg}</em></span>
              </div>
            ))}
          </div>
          <div className="ls-divider" />

          <div className="ls-section">
            <div className="ls-heading">Login Steps</div>
            {STEPS.map((t, i) => {
              const cur = STEP_KEYS.indexOf(step)
              const cls = cur === i ? 'active' : cur > i ? 'done' : ''
              return (
                <div key={i} className={`ls-step ${cls}`}>
                  <span className="ls-step-num">{i+1}</span>
                  <span className="ls-step-text">{t}</span>
                </div>
              )
            })}
          </div>
          <div className="ls-divider" />

          <div className="ls-section">
            <div className="ls-heading">Why OTP Is Safe</div>
            <ul className="ls-list">
              <li><Mail size={12}/>Valid for 5 minutes only</li>
              <li><Key size={12}/>Single-use — deleted after verify</li>
              <li><Smartphone size={12}/>Requires access to your inbox</li>
              <li><Shield size={12}/>Logged in audit trail</li>
            </ul>
          </div>
          <div className="ls-divider" />

          <div className="ls-tip">
            <div className="ls-tip-title">ISO 27001 Reference</div>
            <p><strong>Annex A.8.5</strong> — Secure Authentication mandates MFA for critical systems. A password alone does not satisfy this control.</p>
          </div>
        </aside>

        {/* ── Center: Form + Audit ── */}
        <div className="login-main">

          {/* Form */}
          <div className="login-form-wrap">
            {step === 'signin' && (
              <>
                <div className="login-form-header">
                  <h2>ISO 27001</h2>
                  <p>Secure Access Portal</p>
                </div>
                <form className="login-form" onSubmit={handleSignIn}>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" required />
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
                  {error && <div className="login-err"><AlertCircle size={14}/><span>{error}</span></div>}
                  <button type="submit" disabled={loading}>{loading ? 'Sending OTP…' : 'Sign In'}</button>
                </form>
                <p className="login-note">Use your real email — an OTP will be sent to it. Do not use your real password.</p>
              </>
            )}
            {step === 'mfa' && (
              <>
                <div className="login-form-header">
                  <h2>Verify Identity</h2>
                  <p>Code sent to <strong>{maskEmail(email)}</strong></p>
                </div>
                <form className="login-form" onSubmit={handleVerify}>
                  <input type="text" value={mfaCode} onChange={e=>setMfaCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="6-digit code" maxLength="6" inputMode="numeric" required />
                  {error && <div className="login-err"><AlertCircle size={14}/><span>{error}</span></div>}
                  <button type="submit" disabled={loading}>{loading ? 'Verifying…' : 'Verify Code'}</button>
                  <button type="button" className="login-back" onClick={()=>{setStep('signin');setMfaCode('');setError('')}}>Back</button>
                </form>
              </>
            )}
            {step === 'success' && (
              <div className="login-success">
                <div className="login-check">✓</div>
                <h2>Welcome</h2>
                <p>Redirecting…</p>
              </div>
            )}
          </div>

          {/* Audit Log */}
          <div className="audit-wrap">
            <div className="audit-top">
              <div>
                <div className="audit-title"><Clock size={13}/>Authentication Audit Log</div>
                <div className="audit-sub">ISO 27001 Annex A.8.15 — Logging &amp; Monitoring</div>
              </div>
              <button className="audit-refresh-btn" onClick={fetchLog} title="Refresh">
                <RefreshCw size={12}/>
              </button>
            </div>

            <div className="audit-table-wrap">
              {logError ? (
                <div className="audit-empty">Backend unreachable — start the server to see live logs.</div>
              ) : firstLoad ? (
                <div className="audit-empty">Loading…</div>
              ) : auditLog.length === 0 ? (
                <div className="audit-empty">No events yet. Try logging in to generate entries.</div>
              ) : (
                <table className="audit-table">
                  <thead><tr><th>Timestamp</th><th>Email</th><th>Event</th><th>Status</th><th>IP</th></tr></thead>
                  <tbody>
                    {auditLog.map((row, i) => (
                      <tr key={i} className={`audit-row-${row.status}`}>
                        <td className="audit-mono">{row.timestamp}</td>
                        <td className="audit-mono">{maskEmail(row.email)}</td>
                        <td>{row.event}</td>
                        <td>
                          <span className={`audit-badge ab-${row.status}`}>
                            {row.status==='success'&&<CheckCircle size={10}/>}
                            {row.status==='failed'&&<XCircle size={10}/>}
                            {row.status==='pending'&&<Clock size={10}/>}
                            {row.status}
                          </span>
                        </td>
                        <td className="audit-mono">{row.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="audit-footer">
              Logged per Annex A.8.15 · Emails &amp; IPs masked per Annex A.5.34 (data minimization)
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
