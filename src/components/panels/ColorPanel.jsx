// src/components/panels/ColorPanel.jsx — Premium color selector
import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../context/store'

const PALETTE = [
  // Neutrals
  '#ffffff', '#f0f0f0', '#d4d4d4', '#808080', '#404040', '#1a1a1a', '#000000',
  // Warm
  '#ff4d00', '#ff8c42', '#ffd166', '#ffb347', '#e63946',
  // Cool
  '#00f0ff', '#0077b6', '#023e8a', '#7b2d8b', '#5a189a',
  // Nature
  '#c8ff00', '#52b788', '#2d6a4f', '#95d5b2', '#40916c',
  // Pastel
  '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff', '#cdb4db',
]

const PRESETS = [
  { name: 'CHALK', color: '#f0f0f0', roughness: 0.95, metalness: 0.0 },
  { name: 'SATIN', color: '#ffffff', roughness: 0.3, metalness: 0.05 },
  { name: 'GLOSSY', color: '#1a1a1a', roughness: 0.05, metalness: 0.1 },
  { name: 'CHROME', color: '#c0c0c0', roughness: 0.1, metalness: 0.9 },
  { name: 'GOLD', color: '#d4a820', roughness: 0.2, metalness: 0.8 },
  { name: 'VELVET', color: '#1a0a1e', roughness: 0.9, metalness: 0.0 },
]

export default function ColorPanel() {
  const { color, setColor, roughness, setRoughness, metalness, setMetalness, envMapIntensity, setEnvMapIntensity } = useStore()
  const [customColor, setCustomColor] = useState(color)

  const handleCustom = (e) => {
    setCustomColor(e.target.value)
    setColor(e.target.value)
  }

  const applyPreset = (p) => {
    setColor(p.color)
    setCustomColor(p.color)
    setRoughness(p.roughness)
    setMetalness(p.metalness)
  }

  return (
    <motion.div
      className="space-y-7"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Material presets */}
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-3">MATERIAL PRESETS</p>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              className="relative overflow-hidden py-2.5 px-2 border border-white/6 hover:border-acid/30 transition-all duration-200 group rounded-sm"
              style={{ background: 'rgba(255,255,255,0.02)' }}
              onClick={() => applyPreset(p)}
            >
              <div
                className="w-full h-5 rounded-sm mb-1.5 transition-transform duration-200 group-hover:scale-95"
                style={{ background: p.color, boxShadow: `0 2px 8px ${p.color}44` }}
              />
              <span className="font-mono text-[0.55rem] tracking-wider text-chrome/35 group-hover:text-chrome/60 block text-center transition-colors">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color swatches */}
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-3">COLOR PALETTE</p>
        <div className="grid grid-cols-7 gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              className={`swatch ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => { setColor(c); setCustomColor(c) }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Custom color */}
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-3">CUSTOM</p>
        <div className="flex items-center gap-3 p-3 border border-white/6 rounded-sm" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="relative">
            <input
              type="color"
              value={customColor}
              onChange={handleCustom}
              className="opacity-0 absolute inset-0 w-full h-full cursor-none"
            />
            <div
              className="w-9 h-9 rounded-sm border border-white/10 cursor-none"
              style={{ background: customColor, boxShadow: `0 0 12px ${customColor}44` }}
            />
          </div>
          <div>
            <span className="font-mono text-xs text-chrome/60 uppercase block">{customColor}</span>
            <span className="font-mono text-[0.55rem] text-chrome/25">Click to open picker</span>
          </div>
        </div>
      </div>

      {/* Material sliders */}
      <div className="space-y-5">
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35">MATERIAL PROPERTIES</p>

        {[
          { label: 'ROUGHNESS', value: roughness, set: setRoughness, min: 0, max: 1, step: 0.01, color: 'var(--chrome)' },
          { label: 'METALNESS', value: metalness, set: setMetalness, min: 0, max: 1, step: 0.01, color: 'var(--ice)' },
          { label: 'ENV LIGHT', value: envMapIntensity, set: setEnvMapIntensity, min: 0, max: 3, step: 0.05, color: 'var(--acid)' },
        ].map((slider) => (
          <div key={slider.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-xs text-chrome/35">{slider.label}</span>
              <span className="font-mono text-xs text-acid">{slider.value.toFixed(2)}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={(e) => slider.set(parseFloat(e.target.value))}
                className="w-full"
              />
              {/* Value indicator */}
              <div
                className="absolute bottom-0 h-0.5 rounded-full pointer-events-none"
                style={{
                  left: 0,
                  width: `${((slider.value - slider.min) / (slider.max - slider.min)) * 100}%`,
                  background: slider.color,
                  opacity: 0.4,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
