// src/components/panels/AIPanel.jsx — Premium AI generation panel
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import axios from 'axios'
import useStore from '../../context/store'

const STYLES = [
  { id: 'streetwear', label: 'STREET', desc: 'Urban, raw, bold', icon: '◈' },
  { id: 'minimalist', label: 'MINIMAL', desc: 'Clean, pure, silent', icon: '○' },
  { id: 'luxury',     label: 'LUXURY',  desc: 'Premium, refined', icon: '◇' },
  { id: 'cyber',      label: 'CYBER',   desc: 'Neon, glitch, tech', icon: '⬡' },
  { id: 'vintage',    label: 'VINTAGE', desc: 'Retro, distressed', icon: '◉' },
  { id: 'abstract',   label: 'ABSTRACT', desc: 'Shapes, forms, art', icon: '◐' },
]

const STYLE_MODIFIERS = {
  streetwear: 'urban streetwear style, bold graffiti elements, gritty textures, spray paint aesthetic, street art',
  minimalist: 'minimal clean design, pure geometric shapes, lots of negative space, Scandinavian aesthetic, monochromatic',
  luxury:     'high-end luxury fashion pattern, gold and black, premium texture, subtle elegance, haute couture',
  cyber:      'cyberpunk neon aesthetic, glitch art, digital circuits, electric colors on dark background, matrix',
  vintage:    'vintage retro distressed texture, worn fabric feel, faded 70s color palette, aged print',
  abstract:   'abstract expressionist, bold color fields, dynamic brushstrokes, contemporary art, geometric abstraction',
}

const PROMPTS_EXAMPLES = [
  'dragon scales with iridescent shimmer',
  'abstract marble ink swirls',
  'neon circuit board traces',
  'vintage sun faded typography',
  'geometric tribal mandala',
  'watercolor cherry blossoms',
]

export default function AIPanel() {
  const {
    prompt, setPrompt, aiStyle, setAiStyle,
    isGenerating, setIsGenerating,
    generatedImages, addGeneratedImage,
    setTexture, setTextureUrl,
  } = useStore()

  const [error, setError] = useState(null)
  const [selectedImg, setSelectedImg] = useState(null)

  const applyImage = (url) => {
    const loader = new THREE.TextureLoader()
    loader.load(url, (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.flipY = true // Standardize orientation
      tex.colorSpace = THREE.SRGBColorSpace
      tex.needsUpdate = true
      setTexture(tex)
      setTextureUrl(url)
      setSelectedImg(url)
    })
  }

  const generate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)
    console.log('[AI GEN] Starting generation with prompt:', prompt)
    try {
      const fullPrompt = `Seamless fabric texture pattern for clothing, ${prompt}, ${STYLE_MODIFIERS[aiStyle]}, flat design suitable for tiling, no text, no people, high resolution`
      const res = await axios.post('/api/generate', { prompt: fullPrompt })
      console.log('[AI GEN] Response received:', res.data)
      const imageUrl = res.data.imageUrl
      applyImage(imageUrl)
      addGeneratedImage(imageUrl)
    } catch (err) {
      console.error('[AI GEN] Error:', err)
      setError(err.response?.data?.error || 'Generation failed. Check your API key in .env')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* Style selector */}
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-3">AI STYLE</p>
        <div className="grid grid-cols-2 gap-1.5">
          {STYLES.map((s) => (
            <button
              key={s.id}
              className={`flex items-center gap-2 p-2.5 border rounded-sm transition-all duration-200 ${
                aiStyle === s.id
                  ? 'border-acid/40 bg-acid/6 text-acid'
                  : 'border-white/6 text-chrome/35 hover:border-white/12 hover:text-chrome/60'
              }`}
              onClick={() => setAiStyle(s.id)}
            >
              <span className="text-base w-5 flex-shrink-0">{s.icon}</span>
              <div className="text-left overflow-hidden">
                <p className={`font-mono text-xs tracking-wider truncate ${aiStyle === s.id ? 'text-acid' : 'text-chrome/50'}`}>{s.label}</p>
                <p className="font-mono text-[0.55rem] text-chrome/25 truncate">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-2.5">DESCRIBE YOUR DESIGN</p>
        <textarea
          className="prompt-input h-22"
          placeholder={`e.g. ${PROMPTS_EXAMPLES[Math.floor(Math.random() * PROMPTS_EXAMPLES.length)]}...`}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) generate() }}
          rows={3}
        />
        <div className="flex items-center justify-between mt-1.5">
          <p className="font-mono text-[0.55rem] text-chrome/20">⌘ + Enter to generate</p>
          <p className="font-mono text-[0.55rem] text-chrome/20">{prompt.length}/200</p>
        </div>
      </div>

      {/* Quick prompts */}
      <div>
        <p className="font-mono text-[0.6rem] tracking-widest text-chrome/20 mb-2">QUICK PROMPTS</p>
        <div className="flex flex-wrap gap-1.5">
          {PROMPTS_EXAMPLES.slice(0, 4).map((p) => (
            <button
              key={p}
              className="style-chip text-[0.58rem] py-1 px-2"
              onClick={() => setPrompt(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        className={`w-full btn-primary flex items-center justify-center gap-3 ${isGenerating ? 'opacity-60 pointer-events-none' : ''}`}
        onClick={generate}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
            <span>GENERATING…</span>
          </>
        ) : (
          <>
            <span className="text-lg">⬡</span>
            <span>GENERATE TEXTURE</span>
          </>
        )}
      </button>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex gap-2 p-3 border border-ember/20 rounded-sm bg-ember/5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className="text-ember text-sm flex-shrink-0">⚠</span>
            <p className="font-mono text-xs text-ember leading-relaxed">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated history */}
      <AnimatePresence>
        {generatedImages.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-3">GENERATED ({generatedImages.length})</p>
            <div className="grid grid-cols-3 gap-1.5">
              {generatedImages.map((url, i) => (
                <motion.button
                  key={url + i}
                  className={`aspect-square rounded-sm overflow-hidden border-2 transition-all duration-200 relative group ${
                    selectedImg === url ? 'border-acid shadow-[0_0_12px_rgba(200,255,0,0.2)]' : 'border-transparent hover:border-chrome/15'
                  }`}
                  onClick={() => applyImage(url)}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {selectedImg === url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-acid/20">
                      <span className="text-acid text-xs font-mono">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
