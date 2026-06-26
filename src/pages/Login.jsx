import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import './Login.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [step, setStep] = useState('signin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (pwd) => {
    return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd)
  }

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Invalid email format')
      return
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 symbol')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:3001/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send OTP')
        return
      }
      setStep('mfa')
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleMFASubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: mfaCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Invalid code')
        return
      }
      setStep('success')
      setTimeout(() => {
        onLogin({
          email,
          name: email.split('@')[0],
          mfaEnabled: true,
          loginTime: new Date().toLocaleString()
        })
      }, 500)
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {step === 'signin' && (
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

              <button type="submit" className="btn-minimal" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'mfa' && (
        <div className="login-minimal">
          <div className="login-content">
            <h1>Verify Identity</h1>
            <p>A 6-digit code was sent to <strong>{email}</strong></p>

            <form onSubmit={handleMFASubmit} className="form-minimal">
              <div className="input-group">
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength="6"
                  inputMode="numeric"
                  required
                />
              </div>

              {error && (
                <div className="error-minimal">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn-minimal" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
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
