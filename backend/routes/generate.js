// backend/routes/generate.js
// DALL-E 3 image generation route
const express = require('express')
const router = express.Router()
const OpenAI = require('openai')

router.post('/', async (req, res) => {
  const { prompt } = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A prompt string is required.' })
  }

  if (prompt.length > 1000) {
    return res.status(400).json({ error: 'Prompt too long (max 1000 characters).' })
  }

  if (!process.env.OPENAI_API_KEY) {
    // Return a placeholder image for demo mode (no API key)
    console.warn('[WARN] OPENAI_API_KEY not set — returning placeholder image.')
    return res.json({
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0,10))}/512/512`,
      demo: true,
    })
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid',
      response_format: 'url',
    })

    const imageUrl = response.data[0].url
    res.json({ imageUrl })
  } catch (err) {
    console.error('[OPENAI ERROR]', err.message)

    if (err.status === 401) {
      return res.status(401).json({ error: 'Invalid OpenAI API key.' })
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'OpenAI rate limit reached. Try again shortly.' })
    }
    if (err.status === 400 && err.message.includes('safety')) {
      return res.status(400).json({ error: 'Prompt was rejected by safety filters. Please rephrase.' })
    }

    res.status(500).json({ error: 'Image generation failed. Please try again.' })
  }
})

module.exports = router
