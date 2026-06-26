import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="landing">
      <div className="landing-bg" />

      <div className="landing-content">
        <div className="landing-badge">ISO/IEC 27001:2022</div>

        <h1 className="landing-title">
          Information Security<br />Management System
        </h1>

        <p className="landing-subtitle">
          A comprehensive compliance platform aligned with ISO 27001 — the international
          standard for managing information security risks across people, processes, and technology.
        </p>

        <div className="landing-pillars">
          <div className="pillar">
            <div className="pillar-icon">🔒</div>
            <h3>Confidentiality</h3>
            <p>Ensure information is accessible only to those authorised to have access.</p>
          </div>
          <div className="pillar">
            <div className="pillar-icon">✅</div>
            <h3>Integrity</h3>
            <p>Safeguard the accuracy and completeness of information and processing methods.</p>
          </div>
          <div className="pillar">
            <div className="pillar-icon">⚡</div>
            <h3>Availability</h3>
            <p>Ensure authorised users have access to information and assets when required.</p>
          </div>
        </div>

        <div className="landing-features">
          <div className="feature-item"><span className="feature-dot" /><span>Security Policy Management</span></div>
          <div className="feature-item"><span className="feature-dot" /><span>Password Strength Assessment</span></div>
          <div className="feature-item"><span className="feature-dot" /><span>Compliance Checklist Tracking</span></div>
          <div className="feature-item"><span className="feature-dot" /><span>Security Awareness Quiz</span></div>
          <div className="feature-item"><span className="feature-dot" /><span>Session Management Controls</span></div>
        </div>

        <button className="landing-btn" onClick={() => navigate('/simulate')}>
          Start Simulation
          <span className="btn-arrow">→</span>
        </button>

        <p className="landing-footer">
          Compliant with ISO/IEC 27001:2022 · Annex A Controls · ISMS Framework
        </p>
      </div>
    </div>
  )
}
