import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './PasswordChecker.css'

export default function PasswordChecker() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const checks = [
    { label: 'Password must contain at least 8 characters', icon: '≡', test: (pwd) => pwd.length >= 8 },
    { label: 'Password must include at least 1 uppercase letter', icon: 'Aa', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Password must include at least 1 lowercase letter', icon: 'a', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Password must include at least 1 number', icon: '123', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Password must include at least 1 symbol', icon: '!@#', test: (pwd) => /[!@#$%^&*]/.test(pwd) },
    { label: 'Password must not contain spaces', icon: '⊘', test: (pwd) => !/\s/.test(pwd) },
    { label: 'Password must not be a common or weak password', icon: '🛡️', test: (pwd) => {
      const common = ['123', '456', 'abc', 'password', 'qwerty', 'admin']
      return !common.some(pattern => pwd.toLowerCase().includes(pattern))
    }}
  ]

  const results = checks.map(check => ({
    ...check,
    passed: check.test(password)
  }))

  const allPassed = results.every(r => r.passed)
  const passedCount = results.filter(r => r.passed).length

  const getStrength = () => {
    if (passedCount === 0) return { level: 'None', rating: 'Not Rated' }
    if (passedCount <= 2) return { level: 'Weak', rating: 'Too Weak' }
    if (passedCount <= 4) return { level: 'Good', rating: 'Good' }
    if (passedCount <= 6) return { level: 'Strong', rating: 'Strong' }
    return { level: 'Very Strong', rating: 'Very Strong' }
  }

  const strength = getStrength()

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lower = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*'
    
    let generated = ''
    generated += upper[Math.floor(Math.random() * upper.length)]
    generated += lower[Math.floor(Math.random() * lower.length)]
    generated += numbers[Math.floor(Math.random() * numbers.length)]
    generated += symbols[Math.floor(Math.random() * symbols.length)]
    
    const all = upper + lower + numbers + symbols
    for (let i = generated.length; i < 12; i++) {
      generated += all[Math.floor(Math.random() * all.length)]
    }
    
    setPassword(generated.split('').sort(() => Math.random() - 0.5).join(''))
  }

  return (
    <div className="password-checker">
      <div className="checker-header">
        <h2>Password Policy Checker</h2>
        <p>Enter a password below to check if it meets the security policy guidelines.</p>
      </div>

      <div className="checker-card">
        <div className="input-section">
          <label>Password Input</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="policy-section">
          <h3>Policy Guidelines</h3>
          <div className="guidelines-list">
            {results.map((result, idx) => (
              <div key={idx} className={`guideline ${result.passed ? 'passed' : 'failed'}`}>
                <div className="guideline-icon">{result.icon}</div>
                <span className="guideline-text">{result.label}</span>
                <div className={`guideline-circle ${result.passed ? 'filled' : 'empty'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="strength-section">
          <h3>Password Strength Rating</h3>
          <div className="strength-box">
            <div className="strength-badge">🛡️ Rating: <strong>{strength.rating}</strong></div>
            <div className="strength-bars">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`bar ${i <= Math.ceil((passedCount / results.length) * 4) ? 'filled' : ''}`}></div>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-generate" onClick={generatePassword}>
          🔄 Generate Strong Password
        </button>
      </div>
    </div>
  )
}
