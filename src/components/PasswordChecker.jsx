import React, { useState } from 'react'
import { Eye, EyeOff, RefreshCw, Shield } from 'lucide-react'
import './PasswordChecker.css'

const WEAK_PASSWORDS = [
  'password','password123','123456','12345678','qwerty','admin',
  'letmein','welcome','monkey','dragon','master','abc123',
  'iloveyou','sunshine','princess','shadow','trustno1','superman'
]

const CHECKS = [
  { id: 'len',    icon: '≡',   label: 'Password must contain at least 12 characters',        test: p => p.length >= 12 },
  { id: 'upper',  icon: 'Aa',  label: 'Password must include at least 1 uppercase letter',    test: p => /[A-Z]/.test(p) },
  { id: 'lower',  icon: 'a',   label: 'Password must include at least 1 lowercase letter',    test: p => /[a-z]/.test(p) },
  { id: 'num',    icon: '123', label: 'Password must include at least 1 number',              test: p => /[0-9]/.test(p) },
  { id: 'sym',    icon: '!@#', label: 'Password must include at least 1 symbol',              test: p => /[^A-Za-z0-9]/.test(p) },
  { id: 'space',  icon: '⊘',   label: 'Password must not contain spaces',                    test: p => p.length > 0 && !/\s/.test(p) },
  { id: 'common', icon: '🛡',  label: 'Password must not be a common or weak password',      test: p => p.length > 0 && !WEAK_PASSWORDS.includes(p.toLowerCase()) },
]

function getStrength(passed, total) {
  if (passed === 0) return { label: 'Not Rated', bars: 0 }
  if (passed <= 2)  return { label: 'Too Weak',  bars: 1 }
  if (passed <= 4)  return { label: 'Weak',      bars: 2 }
  if (passed <= 6)  return { label: 'Strong',    bars: 3 }
  return               { label: 'Very Strong', bars: 4 }
}

function generateStrongPassword() {
  const U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const L = 'abcdefghijklmnopqrstuvwxyz'
  const N = '0123456789'
  const S = '!@#$%^&*()_+[]'
  let pw = U[~~(Math.random()*U.length)] + U[~~(Math.random()*U.length)]
         + L[~~(Math.random()*L.length)] + L[~~(Math.random()*L.length)]
         + N[~~(Math.random()*N.length)] + N[~~(Math.random()*N.length)]
         + S[~~(Math.random()*S.length)] + S[~~(Math.random()*S.length)]
  const all = U + L + N + S
  while (pw.length < 16) pw += all[~~(Math.random()*all.length)]
  return pw.split('').sort(() => Math.random() - .5).join('')
}

export default function PasswordChecker() {
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)

  const results   = CHECKS.map(c => ({ ...c, passed: c.test(password) }))
  const passed    = results.filter(r => r.passed).length
  const allPassed = passed === CHECKS.length
  const strength  = getStrength(passed, CHECKS.length)

  return (
    <div className="pc-root">

      {/* ── LEFT: Procedure Panel ── */}
      <aside className="pc-sidebar">
        <div className="pc-sidebar-brand">
          <Shield size={22} />
          <div>
            <div className="pc-sidebar-title">ISO 27001 Compliance</div>
            <div className="pc-sidebar-sub">Password Policy — Annex A.5.17</div>
          </div>
        </div>

        <div className="pc-sidebar-section">
          <div className="pc-sidebar-heading">What You'll Practice</div>
          <ul className="pc-sidebar-list">
            <li><span className="pc-list-icon"><Shield size={14}/></span> Create a strong, policy-compliant password</li>
            <li><span className="pc-list-icon"><Shield size={14}/></span> Understand each password rule and why it exists</li>
            <li><span className="pc-list-icon"><Shield size={14}/></span> Recognize weak vs. strong password patterns</li>
          </ul>
        </div>

        <div className="pc-sidebar-divider" />

        <div className="pc-sidebar-section">
          <div className="pc-sidebar-heading">Why It Matters</div>
          <p className="pc-sidebar-body">
            Strong passwords are the first line of defense against unauthorized access.
            ISO 27001 Annex A.5.17 mandates that organizations enforce authentication
            information policies to protect information assets.
          </p>
        </div>

        <div className="pc-sidebar-divider" />

        <div className="pc-sidebar-section">
          <div className="pc-sidebar-heading">ISO 27001 Reference</div>
          <p className="pc-sidebar-body">
            <strong>Annex A.5.17</strong> — Authentication Information<br /><br />
            Organizations shall control allocation of authentication information.
            Passwords must meet complexity, length, and uniqueness requirements
            to reduce the risk of unauthorized access.
          </p>
        </div>

        <div className="pc-sidebar-divider" />

        <div className="pc-tips-box">
          <div className="pc-tips-title">Tips</div>
          <p>Use a mix of uppercase, lowercase, numbers, and symbols. Avoid personal information or common words. Use the generator if you need a compliant password immediately.</p>
        </div>
      </aside>

      {/* ── RIGHT: Interactive Checker ── */}
      <main className="pc-main">
        <div className="pc-main-header">
          <h2>Password Policy Checker</h2>
          <p>Enter a password below to check if it meets ISO 27001 Annex A.5.17 security policy guidelines.</p>
        </div>

        {/* Password Input */}
        <div className="pc-field-group">
          <label className="pc-label">Password Input</label>
          <div className="pc-input-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              className="pc-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            <button className="pc-eye-btn" onClick={() => setShowPw(p => !p)} type="button">
              {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>
        </div>

        {/* Policy Guidelines */}
        <div className="pc-field-group">
          <label className="pc-label">Policy Guidelines</label>
          <div className="pc-guidelines">
            {results.map((r, i) => (
              <div key={i} className={`pc-gl-row ${r.passed ? 'passed' : ''}`}>
                <span className="pc-gl-icon">{r.icon}</span>
                <span className="pc-gl-text">{r.label}</span>
                <span className={`pc-gl-circle ${r.passed ? 'checked' : ''}`}>
                  {r.passed ? '✓' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strength Rating */}
        <div className="pc-field-group">
          <label className="pc-label">Password Strength Rating</label>
          <div className="pc-strength-box">
            <div className="pc-strength-left">
              <Shield size={18} className="pc-shield-icon" />
              <span>Rating: <strong>{strength.label}</strong></span>
            </div>
            <div className="pc-strength-bars">
              {[1,2,3,4].map(i => (
                <div key={i} className={`pc-bar ${i <= strength.bars ? `lit-${strength.bars}` : ''}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button className="pc-btn-generate" onClick={() => setPassword(generateStrongPassword())}>
          <RefreshCw size={16} /> Generate Strong Password
        </button>

        {/* All passed banner */}
        {allPassed && (
          <div className="pc-verified-banner">
            <Shield size={22} />
            <div>
              <div className="pc-verified-title">Password is Policy-Compliant</div>
              <div className="pc-verified-body">
                Your password meets all ISO 27001 Annex A.5.17 requirements. This is the standard
                organizations must enforce to protect information assets from unauthorized access.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
