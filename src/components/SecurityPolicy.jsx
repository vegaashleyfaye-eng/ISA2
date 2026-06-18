import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import './SecurityPolicy.css'

export default function SecurityPolicy() {
  const [expandedSection, setExpandedSection] = useState(0)

  const policies = [
    {
      title: 'Access Control Policy',
      icon: '🔐',
      content: [
        'Implement role-based access control (RBAC)',
        'Multi-factor authentication required for all users',
        'Regular access reviews (quarterly)',
        'Immediate revocation upon role change'
      ]
    },
    {
      title: 'Password Policy',
      icon: '🔑',
      content: [
        'Minimum 8 characters required',
        'Must contain uppercase, lowercase, numbers, special characters',
        'Password changes every 90 days',
        'Cannot reuse last 5 passwords',
        'Account lockout after 5 failed attempts'
      ]
    },
    {
      title: 'Data Protection',
      icon: '📊',
      content: [
        'All data encrypted in transit (TLS 1.2+)',
        'Sensitive data encrypted at rest',
        'Regular backups (daily)',
        'Data retention: 7 years for audit logs',
        'GDPR compliance for personal data'
      ]
    },
    {
      title: 'Incident Response',
      icon: '🚨',
      content: [
        'Report security incidents within 24 hours',
        'Incident classification by severity',
        'Root cause analysis for all incidents',
        'Communication plan for stakeholders',
        'Lessons learned documentation'
      ]
    },
    {
      title: 'Audit & Monitoring',
      icon: '📋',
      content: [
        'All user activities logged',
        'Real-time security alerts',
        'Monthly security reviews',
        'Annual external penetration testing',
        'Compliance audits bi-annually'
      ]
    },
    {
      title: 'Training & Awareness',
      icon: '👥',
      content: [
        'Annual security training for all employees',
        'New hire training within first week',
        'Phishing simulations quarterly',
        'Security awareness campaign monthly',
        'Role-specific advanced training'
      ]
    }
  ]

  return (
    <div className="security-policy">
      <div className="policy-header">
        <h2>Security Policy Dashboard</h2>
        <p>ISO 27001 Information Security Management System Policies</p>
      </div>

      <div className="policies-grid">
        {policies.map((policy, idx) => (
          <div
            key={idx}
            className={`policy-card ${expandedSection === idx ? 'expanded' : ''}`}
          >
            <button
              className="policy-title"
              onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
            >
              <span className="policy-icon">{policy.icon}</span>
              <span className="policy-name">{policy.title}</span>
              {expandedSection === idx ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {expandedSection === idx && (
              <div className="policy-content">
                <ul>
                  {policy.content.map((item, i) => (
                    <li key={i}>
                      <span className="bullet">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="policy-footer">
        <p>Last Updated: June 2026 | ISO 27001:2022 Compliant</p>
      </div>
    </div>
  )
}
