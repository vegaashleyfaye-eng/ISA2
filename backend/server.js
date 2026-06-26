import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { BrevoClient } from '@getbrevo/brevo'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// ── In-memory stores ──────────────────────────────────────────────────
// OTP store: { email -> { code, expiresAt } }
const otpStore = new Map()

// Audit log: array of event objects (newest first)
const auditLog = []

const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes
const MAX_LOG_ENTRIES = 100           // cap to avoid unbounded memory

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY })

// ── Helpers ───────────────────────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function getClientIP(req) {
  // Respect X-Forwarded-For when behind a proxy, fall back to socket address
  const forwarded = req.headers['x-forwarded-for']
  const raw = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress
  // Strip IPv6-mapped IPv4 prefix (::ffff:) and normalize IPv6 loopback
  if (!raw) return 'unknown'
  if (raw === '::1') return '127.0.0.1'
  return raw.replace(/^::ffff:/, '')
}

function maskIP(ip) {
  if (!ip || ip === 'unknown') return 'unknown'
  const parts = ip.split('.')
  if (parts.length === 4) {
    // IPv4: show first two octets, mask last two → 192.168.x.x
    return `${parts[0]}.${parts[1]}.x.x`
  }
  // IPv6: mask last group → 2001:db8:x:xxxx
  return ip.replace(/:[^:]+$/, ':xxxx')
}

function addAuditEntry(entry) {
  auditLog.unshift({
    timestamp: new Date().toISOString(),
    ...entry,
  })
  // Keep log bounded
  if (auditLog.length > MAX_LOG_ENTRIES) auditLog.pop()
}

function formatTimestamp(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  })
}

// ── GET /api/audit-log ────────────────────────────────────────────────
app.get('/api/audit-log', (req, res) => {
  const sanitized = auditLog.map(e => ({
    timestamp: formatTimestamp(e.timestamp),
    email: e.email,
    event: e.event,
    status: e.status,
    reason: e.reason,
    ip: maskIP(e.ip),        // masked for display
  }))
  res.json(sanitized)
})

// ── POST /api/send-otp ────────────────────────────────────────────────
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body
  const ip = getClientIP(req)

  if (!email || !email.includes('@') || !email.includes('.')) {
    addAuditEntry({ email: email || '(blank)', event: 'Login attempt', status: 'failed', reason: 'Invalid email address', ip })
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  const code = generateOTP()
  const expiresAt = Date.now() + OTP_EXPIRY_MS
  otpStore.set(email.toLowerCase(), { code, expiresAt })

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: 'Your ISO 27001 Demo OTP Code',
      to: [{ email }],
      sender: {
        name: 'ISO 27001 Demo',
        email: process.env.OTP_FROM_EMAIL,
      },
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a1a2e; margin-bottom: 8px;">Your Verification Code</h2>
          <p style="color: #555; margin-bottom: 24px;">
            Use the code below to complete your Multi-Factor Authentication (ISO 27001 Annex A.8.5).
            This code expires in <strong>5 minutes</strong>.
          </p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1a1a2e; text-align: center; padding: 16px; background: #f4f4f8; border-radius: 6px;">
            ${code}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">
            If you did not request this code, please ignore this email.
          </p>
        </div>
      `,
    })

    addAuditEntry({ email, event: 'OTP sent', status: 'success', reason: 'Credentials accepted — OTP dispatched', ip })
    return res.json({ success: true, message: 'OTP sent successfully.' })
  } catch (err) {
    console.error('Brevo error:', err?.message || err)
    addAuditEntry({ email, event: 'OTP send failed', status: 'failed', reason: 'Email service error', ip })
    return res.status(500).json({ error: 'Failed to send OTP. Check your Brevo config.' })
  }
})

// ── POST /api/verify-otp ──────────────────────────────────────────────
app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body
  const ip = getClientIP(req)

  if (!email || !code) {
    addAuditEntry({ email: email || '(blank)', event: 'MFA verification', status: 'failed', reason: 'Missing email or code', ip })
    return res.status(400).json({ error: 'Email and code are required.' })
  }

  const record = otpStore.get(email.toLowerCase())

  if (!record) {
    addAuditEntry({ email, event: 'MFA verification', status: 'failed', reason: 'No OTP found — not requested or already used', ip })
    return res.status(400).json({ error: 'No OTP found for this email. Please request a new code.' })
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase())
    addAuditEntry({ email, event: 'MFA verification', status: 'failed', reason: 'OTP expired', ip })
    return res.status(400).json({ error: 'OTP has expired. Please request a new code.' })
  }

  if (record.code !== code) {
    addAuditEntry({ email, event: 'MFA verification', status: 'failed', reason: 'Incorrect OTP entered', ip })
    return res.status(400).json({ error: 'Incorrect code. Please try again.' })
  }

  otpStore.delete(email.toLowerCase())
  addAuditEntry({ email, event: 'Login successful', status: 'success', reason: 'MFA verified — access granted', ip })
  return res.json({ success: true, message: 'OTP verified successfully.' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
