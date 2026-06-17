import React, { useState } from 'react'
import { AlertCircle, Check, X } from 'lucide-react'
import './Login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [step, setStep] = useState('signin')
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (pwd) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd)
  }

  const getPasswordChecks = () => {
    return [
      { label: 'At least 1 uppercase', passed: /[A-Z]/.test(password) },
      { label: 'At least 1 number', passed: /[0-9]/.test(password) },
      { label: 'At least 8 characters', passed: password.length >= 8 },
      { label: 'At least 1 symbol', passed: /[!@#$%^&*]/.test(password) },
    ]
  }

  const getPasswordStrength = () => {
    const checks = getPasswordChecks()
    const passed = checks.filter(c => c.passed).length
    if (passed === 0) return { level: 'None', color: '#ddd' }
    if (passed === 1) return { level: 'Weak', color: '#ef4444' }
    if (passed === 2) return { level: 'Fair', color: '#f59e0b' }
    if (passed === 3) return { level: 'Good', color: '#3b82f6' }
    return { level: 'Strong', color: '#10b981' }
  }

  const handleCredentialsSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Invalid email format')
      return
    }

    if (!validatePassword(password)) {
      setError('Password does not meet requirements')
      return
    }

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setStep('mfa')
  }

  const handleMFASubmit = (e) => {
    e.preventDefault()
    setError('')

    if (mfaCode === '123456') {
      setStep('success')
      setTimeout(() => {
        onLogin({
          email,
          name: email.split('@')[0],
          mfaEnabled: true,
          loginTime: new Date().toLocaleString()
        })
      }, 500)
    } else {
      setError('Invalid MFA code. Try 123456')
    }
  }

  const checks = getPasswordChecks()
  const strength = getPasswordStrength()
  const passedCount = checks.filter(c => c.passed).length

  return (
    <div className="login-container">
      {step === 'signin' && !isSignup && (
        <div className="login-minimal">
          <div className="login-content">
            <h1>ISO 27001</h1>
            <p>Secure Access Portal</p>

            <form onSubmit={handleCredentialsSubmit} className="form-minimal">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>

              {error && (
                <div className="error-minimal">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-minimal">
                Sign In
              </button>
            </form>

            <p className="toggle-mode">
              Don't have an account?{' '}
              <button
                type="button"
                className="btn-toggle"
                onClick={() => {
                  setIsSignup(true)
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                  setError('')
                }}
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      )}

      {step === 'signin' && isSignup && (
        <div className="login-minimal">
          <div className="login-content">
            <h1>Create Account</h1>
            <p>Set up your secure account</p>

            <form onSubmit={handleCredentialsSubmit} className="form-minimal">
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="password-section">
                <label>New Password</label>
                <div className="input-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>

                <label className="confirm-label">
                  Confirm New Password
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      setConfirmPassword('')
                    }}
                  >
                    Clear
                  </button>
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <div className="strength-meter-mini">
                  <div className="bars">
                    <div className="bar" style={{ backgroundColor: passedCount >= 1 ? strength.color : '#ddd' }}></div>
                    <div className="bar" style={{ backgroundColor: passedCount >= 2 ? strength.color : '#ddd' }}></div>
                    <div className="bar" style={{ backgroundColor: passedCount >= 3 ? strength.color : '#ddd' }}></div>
                  </div>
                </div>

                <div className="strength-status">
                  {strength.level !== 'None' && <span>{strength.level} password. Must contain;</span>}
                </div>

                <div className="checks-list">
                  {checks.map((check, idx) => (
                    <div key={idx} className={`check-item ${check.passed ? 'passed' : 'failed'}`}>
                      {check.passed ? (
                        <Check size={18} />
                      ) : (
                        <X size={18} />
                      )}
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="error-minimal">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-minimal">
                Create Account
              </button>
            </form>

            <p className="toggle-mode">
              Already have an account?{' '}
              <button
                type="button"
                className="btn-toggle"
                onClick={() => {
                  setIsSignup(false)
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                  setError('')
                }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}

      {step === 'mfa' && (
        <div className="login-minimal">
          <div className="login-content">
            <h1>Verify Identity</h1>
            <p>Enter your authenticator code</p>

            <form onSubmit={handleMFASubmit} className="form-minimal">
              <div className="input-group">
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  pattern="[0-9]*"
                  required
                />
              </div>

              {error && (
                <div className="error-minimal">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-minimal">
                Verify
              </button>

              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setStep('signin')
                  setMfaCode('')
                  setError('')
                }}
              >
                Back
              </button>
            </form>

            <p className="demo-text">Demo code: 123456</p>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="login-minimal">
          <div className="success-minimal">
            <div className="checkmark">✓</div>
            <h2>Welcome</h2>
            <p>Redirecting...</p>
          </div>
        </div>
      )}
    </div>
  )
}
