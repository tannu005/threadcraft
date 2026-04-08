// backend/routes/upload.js
// File upload route using multer
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const uploadsDir = path.join(__dirname, '..', 'uploads')

// ─── Multer config ─────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex')
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `texture_${unique}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
})

// ─── POST /api/upload ──────────────────────────────────────────────────────
router.post('/', upload.single('texture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' })
  }

  const fileUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/uploads/${req.file.filename}`

  res.json({
    success: true,
    filename: req.file.filename,
    fileUrl,
    size: req.file.size,
    mimetype: req.file.mimetype,
  })
})

// ─── DELETE /api/upload/:filename ─────────────────────────────────────────
router.delete('/:filename', (req, res) => {
  const { filename } = req.params
  // Basic path traversal protection
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    return res.status(400).json({ error: 'Invalid filename.' })
  }

  const filePath = path.join(uploadsDir, filename)
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found.' })
  }

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: 'Could not delete file.' })
    res.json({ success: true })
  })
})

// ─── Multer error handler ──────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum 10MB.' })
    }
  }
  res.status(400).json({ error: err.message || 'Upload failed.' })
})

module.exports = router
