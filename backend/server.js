import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { BrevoClient } from '@getbrevo/brevo'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// In-memory OTP store: { email -> { code, expiresAt } }
const otpStore = new Map()

const OTP_EXPIRY_MS = 5 * 60 * 1000 // 5 minutes

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY })

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// POST /api/send-otp
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body

  if (!email || !email.includes('@') || !email.includes('.')) {
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

    return res.json({ success: true, message: 'OTP sent successfully.' })
  } catch (err) {
    console.error('Brevo error:', err?.message || err)
    return res.status(500).json({ error: 'Failed to send OTP. Check your Brevo config.' })
  }
})

// POST /api/verify-otp
app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required.' })
  }

  const record = otpStore.get(email.toLowerCase())

  if (!record) {
    return res.status(400).json({ error: 'No OTP found for this email. Please request a new code.' })
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase())
    return res.status(400).json({ error: 'OTP has expired. Please request a new code.' })
  }

  if (record.code !== code) {
    return res.status(400).json({ error: 'Incorrect code. Please try again.' })
  }

  otpStore.delete(email.toLowerCase())
  return res.json({ success: true, message: 'OTP verified successfully.' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
