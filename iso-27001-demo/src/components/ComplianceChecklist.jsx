import React, { useState } from 'react'
import { Check, Minus } from 'lucide-react'
import './ComplianceChecklist.css'

export default function ComplianceChecklist() {
  const initialItems = [
    { id: 1, category: 'Information Security Policies', item: 'Document information security policy', status: 'completed' },
    { id: 2, category: 'Information Security Policies', item: 'Conduct annual policy review', status: 'completed' },
    { id: 3, category: 'Access Control', item: 'Implement role-based access control', status: 'completed' },
    { id: 4, category: 'Access Control', item: 'Regular access rights review', status: 'in-progress' },
    { id: 5, category: 'Access Control', item: 'Multi-factor authentication enabled', status: 'completed' },
    { id: 6, category: 'Cryptography', item: 'Encryption in transit (TLS 1.2+)', status: 'completed' },
    { id: 7, category: 'Cryptography', item: 'Encryption at rest for sensitive data', status: 'in-progress' },
    { id: 8, category: 'Physical Security', item: 'Secure facility access', status: 'completed' },
    { id: 9, category: 'Operations Security', item: 'Backup procedures documented', status: 'completed' },
    { id: 10, category: 'Operations Security', item: 'Incident response plan', status: 'completed' },
    { id: 11, category: 'Communications Security', item: 'Secure email implementation', status: 'in-progress' },
    { id: 12, category: 'Supplier Relations', item: 'Third-party security assessments', status: 'pending' },
    { id: 13, category: 'Information Security Incident', item: 'Incident logging system', status: 'completed' },
    { id: 14, category: 'Business Continuity', item: 'Disaster recovery plan tested', status: 'in-progress' },
    { id: 15, category: 'Compliance', item: 'Audit trail maintained', status: 'completed' },
  ]

  const [items, setItems] = useState(initialItems)
  const [filterCategory, setFilterCategory] = useState('All')

  const categories = ['All', ...new Set(items.map(i => i.category))]
  const filteredItems = filterCategory === 'All' ? items : items.filter(i => i.category === filterCategory)

  const stats = {
    completed: items.filter(i => i.status === 'completed').length,
    inProgress: items.filter(i => i.status === 'in-progress').length,
    pending: items.filter(i => i.status === 'pending').length,
  }

  const completionPercentage = Math.round((stats.completed / items.length) * 100)

  const toggleStatus = (id) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const statusCycle = {
          'pending': 'in-progress',
          'in-progress': 'completed',
          'completed': 'pending'
        }
        return { ...item, status: statusCycle[item.status] }
      }
      return item
    }))
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#10b981'
      case 'in-progress': return '#f59e0b'
      case 'pending': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return '✓ Completed'
      case 'in-progress': return '◐ In Progress'
      case 'pending': return '○ Pending'
      default: return status
    }
  }

  return (
    <div className="compliance-checklist">
      <div className="checklist-header">
        <h2>ISO 27001 Compliance Checklist</h2>
        <p>Track implementation of required security controls</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card in-progress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card total">
          <div className="stat-number">{completionPercentage}%</div>
          <div className="stat-label">Complete</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="progress-text">{stats.completed} of {items.length} items completed</p>
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="checklist-items">
        {filteredItems.map(item => (
          <div key={item.id} className="checklist-item">
            <button
              className={`status-btn ${item.status}`}
              onClick={() => toggleStatus(item.id)}
              title={`Click to cycle status (${getStatusLabel(item.status)})`}
            >
              {item.status === 'completed' && <Check size={16} />}
              {item.status === 'in-progress' && <Minus size={16} />}
            </button>
            <div className="item-details">
              <div className="item-category">{item.category}</div>
              <div className="item-name">{item.item}</div>
            </div>
            <span className="item-status" style={{ color: getStatusColor(item.status) }}>
              {getStatusLabel(item.status)}
            </span>
          </div>
        ))}
      </div>

      <div className="checklist-footer">
        <p>💡 Click on any status to cycle through: Pending → In Progress → Completed</p>
      </div>
    </div>
  )
}
