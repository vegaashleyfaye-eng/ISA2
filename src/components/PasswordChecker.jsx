import React, { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, RefreshCw, Shield, Mail, CheckCircle } from 'lucide-react'
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
  const [password, setPassword]       = useState('')
  const [showPw, setShowPw]           = useState(false)
  const [email, setEmail]             = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [otpSent, setOtpSent]         = useState(false)
  const [otpCode, setOtpCode]         = useState('')
  const [otpDigits, setOtpDigits]     = useState(['','','','','',''])
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpError, setOtpError]       = useState('')
  const [otpCooldown, setOtpCooldown] = useState(0)
  const cooldownRef = useRef(null)
  const digitRefs   = useRef([])

  const results   = CHECKS.map(c => ({ ...c, passed: c.test(password) }))
  const passed    = results.filter(r => r.passed).length
  const allPassed = passed === CHECKS.length
  const strength  = getStrength(passed, CHECKS.length)

  const sendOTP = () => {
    if (!email.includes('@') || !email.includes('.')) return
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setOtpCode(code)
    setOtpSent(true)
    setOtpError('')
    setOtpDigits(['','','','','',''])
    setOtpCooldown(30)
    clearInterval(cooldownRef.current)
    cooldownRef.current = setInterval(() => {
      setOtpCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
    setTimeout(() => digitRefs.current[0]?.focus(), 100)
  }

  const handleDigitChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return
    const next = [...otpDigits]
    next[idx] = val
    setOtpDigits(next)
    setOtpError('')
    if (val && idx < 5) digitRefs.current[idx + 1]?.focus()
  }

  const handleDigitKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      digitRefs.current[idx - 1]?.focus()
    }
  }

  const verifyOTP = () => {
    const entered = otpDigits.join('')
    if (entered === otpCode) {
      setOtpVerified(true)
      setOtpError('')
    } else {
      setOtpError('Incorrect code. Please check the code displayed above and try again.')
      setOtpDigits(['','','','','',''])
      digitRefs.current[0]?.focus()
    }
  }

  useEffect(() => () => clearInterval(cooldownRef.current), [])

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
            <li><span className="pc-list-icon"><Mail size={14}/></span> Verify your identity with MFA</li>
            <li><span className="pc-list-icon"><CheckCircle size={14}/></span> Understand why each rule exists</li>
          </ul>
        </div>

        <div className="pc-sidebar-divider" />

        <div className="pc-sidebar-section">
          <div className="pc-sidebar-heading">Why It Matters</div>
          <p className="pc-sidebar-body">
            Strong passwords and MFA are the first line of defense against
            unauthorized access. ISO 27001 Annex A.5.17 mandates that organizations
            enforce authentication information policies to protect information assets.
          </p>
        </div>

        <div className="pc-sidebar-divider" />

        <div className="pc-sidebar-section">
          <div className="pc-sidebar-heading">Procedure Steps</div>
          <div className="pc-steps">
            <div className={`pc-step ${password.length > 0 ? 'done' : 'active'}`}>
              <div className="pc-step-num">1</div>
              <div className="pc-step-text">Enter or generate a password that passes all 7 policy requirements</div>
            </div>
            <div className={`pc-step ${allPassed && !otpVerified ? 'active' : allPassed && otpVerified ? 'done' : ''}`}>
              <div className="pc-step-num">2</div>
              <div className="pc-step-text">Enter your email address to receive an MFA verification code</div>
            </div>
            <div className={`pc-step ${otpVerified ? 'done' : ''}`}>
              <div className="pc-step-num">3</div>
              <div className="pc-step-text">Enter the 6-digit OTP to confirm your identity and complete the exercise</div>
            </div>
          </div>
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
          <p>Enter a password below to check if it meets the security policy guidelines.</p>
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
              disabled={otpVerified}
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
        {!otpVerified && (
          <button className="pc-btn-generate" onClick={() => setPassword(generateStrongPassword())}>
            <RefreshCw size={16} /> Generate Strong Password
          </button>
        )}

        {/* ── EMAIL + OTP SECTION (only shows when all checks pass) ── */}
        {allPassed && !otpVerified && (
          <div className="pc-mfa-section">
            <div className="pc-mfa-header">
              <Mail size={18} />
              <div>
                <div className="pc-mfa-title">Multi-Factor Authentication — Annex A.8.5</div>
                <div className="pc-mfa-sub">All password requirements met. Verify your identity to complete this module.</div>
              </div>
            </div>

            {!otpSent ? (
              <div className="pc-email-row">
                <input
                  type="email"
                  className="pc-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                />
                <button
                  className="pc-btn-send"
                  onClick={sendOTP}
                  disabled={!email.includes('@')}
                >
                  Send OTP
                </button>
              </div>
            ) : (
              <div className="pc-otp-block">
                <div className="pc-otp-info">
                  Code sent to <strong>{email}</strong>.
                  <span className="pc-otp-demo"> (Demo code: <strong>{otpCode}</strong>)</span>
                </div>

                <div className="pc-otp-digits">
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => digitRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="pc-otp-digit"
                      value={d}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleDigitKeyDown(i, e)}
                    />
                  ))}
                </div>

                {otpError && <div className="pc-otp-error">{otpError}</div>}

                <div className="pc-otp-actions">
                  <button className="pc-btn-verify" onClick={verifyOTP} disabled={otpDigits.join('').length < 6}>
                    Verify Code
                  </button>
                  <button
                    className="pc-btn-resend"
                    onClick={sendOTP}
                    disabled={otpCooldown > 0}
                  >
                    {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── VERIFIED STATE ── */}
        {otpVerified && (
          <div className="pc-verified-banner">
            <CheckCircle size={22} />
            <div>
              <div className="pc-verified-title">Identity Verified</div>
              <div className="pc-verified-body">
                Your password meets all ISO 27001 Annex A.5.17 requirements and your identity has been
                confirmed via a second factor (Annex A.8.5). This module is complete.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}