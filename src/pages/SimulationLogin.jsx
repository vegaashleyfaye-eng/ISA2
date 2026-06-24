import React from 'react'
import { useNavigate } from 'react-router-dom'
import Login from './Login'
import './SimulationLogin.css'

export default function SimulationLogin() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // Simulation login complete — go to dashboard with timer
    navigate('/dashboard?sim=1')
  }

  return (
    <div className="sim-login-wrapper">
      {/* Simulation context banner */}
      <div className="sim-login-banner">
        <div className="sim-login-banner-inner">
          <div className="sim-login-step">
            <span className="sim-step-badge">Module 01 of 04</span>
            <span className="sim-step-title">Login + MFA Simulation</span>
          </div>
          <p className="sim-login-desc">
            This is a <strong>simulated secure login</strong>. Practice entering a valid password
            that meets ISO 27001 requirements and verify your identity using MFA.
            No real account is needed.
          </p>
          <div className="sim-login-hints">
            <div className="sim-hint">
              <span className="sim-hint-label">Demo email</span>
              <span className="sim-hint-value">any@valid.email</span>
            </div>
            <div className="sim-hint">
              <span className="sim-hint-label">Password must have</span>
              <span className="sim-hint-value">8+ chars, uppercase, number, symbol</span>
            </div>
            <div className="sim-hint">
              <span className="sim-hint-label">MFA code</span>
              <span className="sim-hint-value">123456</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login component */}
      <Login onLogin={handleLogin} />
    </div>
  )
}
