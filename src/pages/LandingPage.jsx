import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

const MODULES = [
  {
    num: '01',
    title: 'Password Policy Checker',
    desc: 'Test passwords against Annex A.5.17 authentication requirements with real-time policy feedback.'
  },
  {
    num: '02',
    title: 'Security Awareness Quiz',
    desc: 'Ten questions from Annex A.6.3 security awareness requirements with explanatory feedback on every answer.'
  },
  {
    num: '03',
    title: 'Policy Compliance Viewer',
    desc: "Review the security policy controls required under ISO 27001. Understand each control's function and applicability."
  },
  {
    num: '04',
    title: 'Session Lifecycle Simulation',
    desc: 'Experience a full monitored session: initiation, activity logging, inactivity detection, and controlled termination per A.8.5.'
  }
]

const ANNEX_CONTROLS = [
  { code: 'A.5.17', name: 'Authentication Information' },
  { code: 'A.5.16', name: 'Identity Management' },
  { code: 'A.8.5',  name: 'Secure Authentication' },
  { code: 'A.6.3',  name: 'Security Awareness and Training' },
  { code: 'A.8.3',  name: 'Information Access Restriction' },
]

const THREATS = [
  {
    num: '01',
    title: 'Credential Attacks',
    desc: 'Brute force, phishing, and credential stuffing are the leading vectors for unauthorized access. Annex A.5.17 password controls directly reduce this exposure.'
  },
  {
    num: '02',
    title: 'Social Engineering',
    desc: 'Manipulating personnel to bypass technical controls. Security awareness training (A.6.3) is the primary countermeasure, converting people from a vulnerability into a control.'
  },
  {
    num: '03',
    title: 'Session Hijacking',
    desc: 'Theft or interception of authenticated sessions. Session management controls and timeout policies under A.8.5 limit exposure windows.'
  },
  {
    num: '04',
    title: 'Unauthorized Access',
    desc: "Access beyond an individual's authorization scope. Multi-factor authentication and role-based access controls are mandatory requirements for privileged systems."
  }
]

const STATS = [
  { num: '27001', label: 'ISO Standard' },
  { num: '93',    label: 'Annex A Controls' },
  { num: '20 min',label: 'Session Length' },
  { num: '4',     label: 'Modules' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const ctaRef   = useRef(null)

  const handleStart = () => navigate('/simulate')

  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className="lp-nav">
        <span className="lp-nav-brand">ISO 27001</span>
        <button className="lp-nav-start" onClick={handleStart}>Start Simulation</button>
      </nav>

      {/* ── Hero — centered ── */}
      <section className="lp-hero">
        <p className="lp-eyebrow">Information Security Simulation / ISO 27001:2022</p>
        <h1 className="lp-hero-title">
          Security is not a feature.<br />
          <span className="lp-muted">It is a foundation.</span>
        </h1>
        <p className="lp-hero-body">
          ISO 27001 sets the global standard for information security management.
          This simulation puts five of its core controls in your hands — so you understand
          not just what each requirement says, but why it exists.
        </p>
        <div className="lp-hero-actions">
          <button className="lp-start-btn-hero" onClick={handleStart}>Start Simulation</button>
          <button
            className="lp-learn-link"
            onClick={() => ctaRef.current?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn more first
          </button>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="lp-stats-strip">
        {STATS.map(s => (
          <div key={s.label} className="lp-stat-box">
            <span className="lp-stat-num">{s.num}</span>
            <span className="lp-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── CIA Triad ── */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <p className="lp-section-label">Why It Matters</p>
          <h2 className="lp-section-title">Three principles.<br />One standard.</h2>
          <p className="lp-section-body">
            ISO 27001 is built on the CIA triad. Every control in Annex A maps to one or more
            of these principles. Understanding them is understanding the purpose of the standard.
          </p>
          <div className="lp-principles">
            <div className="lp-principle-card">
              <div className="lp-principle-title">Confidentiality</div>
              <p>Information is accessible only to those authorized to access it. Controls prevent unauthorized disclosure through both technical safeguards and administrative policies.</p>
            </div>
            <div className="lp-principle-card">
              <div className="lp-principle-title">Integrity</div>
              <p>Information and processing methods are accurate and complete. Controls prevent unauthorized modification and ensure data can be trusted to reflect reality.</p>
            </div>
            <div className="lp-principle-card">
              <div className="lp-principle-title">Availability</div>
              <p>Authorized users can access information when they need it. Business continuity planning and redundancy controls ensure systems remain operational.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Threat Landscape ── */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-inner">
          <p className="lp-section-label">Threat Landscape</p>
          <h2 className="lp-section-title">What the standard<br />is designed to counter.</h2>
          <p className="lp-section-body">
            Each Annex A control addresses one or more categories of real-world threats.
            Understanding these threats clarifies why each control clause exists.
          </p>
          <div className="lp-threat-grid">
            {THREATS.map(t => (
              <div key={t.num} className="lp-threat-item">
                <span className="lp-threat-num">{t.num}</span>
                <div>
                  <div className="lp-threat-title">{t.title}</div>
                  <p className="lp-threat-desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Annex A Controls ── */}
      <section className="lp-section">
        <div className="lp-section-inner">
          <div className="lp-annex-layout">
            <div>
              <p className="lp-section-label">The Standard</p>
              <h2 className="lp-section-title">Annex A controls<br />in this simulation.</h2>
              <p className="lp-section-body">
                ISO 27001:2022 reorganizes information security controls into four categories:
                Organizational, People, Physical, and Technological. This simulation exercises
                five controls from Annex A directly applicable to authentication and access management.
              </p>
            </div>
            <div className="lp-annex-list">
              {ANNEX_CONTROLS.map(c => (
                <div key={c.code} className="lp-annex-item">
                  <span className="lp-annex-code">{c.code}</span>
                  <span className="lp-annex-name">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-inner">
          <p className="lp-section-label">Simulation Modules</p>
          <h2 className="lp-section-title">Four modules.<br />One session. Twenty minutes.</h2>
          <p className="lp-section-body">
            Each module simulates a real ISO 27001 control. You execute the control,
            receive feedback on its purpose, and see how it connects to the broader standard.
          </p>
          <div className="lp-modules">
            {MODULES.map(m => (
              <div key={m.num} className="lp-module-card">
                <span className="lp-module-num">Module {m.num}</span>
                <div className="lp-module-title">{m.title}</div>
                <p className="lp-module-desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta" ref={ctaRef}>
        <div className="lp-cta-inner">
          <p className="lp-cta-eyebrow">20-Minute Session / 4 Modules / ISO 27001:2022</p>
          <h2 className="lp-cta-title">Ready to begin?</h2>
          <button className="lp-start-btn" onClick={handleStart}>Start Simulation</button>
          <p className="lp-cta-note">No account required. Session expires automatically after 20 minutes.</p>
        </div>
      </section>

    </div>
  )
}