// backend/server.js
// ThreadCraft Express Backend
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')
const fs = require('fs')

const generateRoute = require('./routes/generate')
const uploadRoute = require('./routes/upload')

const app = express()
const PORT = process.env.PORT || 3001

// ─── Ensure uploads dir exists ─────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

// ─── Security middleware ───────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Rate limiting ─────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 50,
  message: { error: 'Too many requests. Please try again later.' },
})
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: { error: 'AI generation limit reached. Wait a moment.' },
})

app.use(limiter)

// ─── General middleware ────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// ─── Static uploads ───────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir))

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/generate', aiLimiter, generateRoute)
app.use('/api/upload',   uploadRoute)

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    openai: !!process.env.OPENAI_API_KEY,
  })
})

// ─── 404 handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Error handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
})

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🟢 ThreadCraft backend running on http://localhost:${PORT}`)
  console.log(`   OpenAI key: ${process.env.OPENAI_API_KEY ? '✓ loaded' : '✗ missing'}`)
  console.log(`   Frontend:   ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`)
})
