// src/components/panels/TexturePanel.jsx — Improved texture upload
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import useStore from '../../context/store'

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_SIZE_MB = 10

export default function TexturePanel() {
  const { textureUrl, setTexture, setTextureUrl, clearTexture } = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const loadTexture = (file) => {
    if (!ACCEPTED.includes(file.type)) {
      setError('Unsupported format. Use PNG, JPG, or WebP.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_SIZE_MB}MB.`)
      return
    }
    setUploading(true)
    setError(null)

    const url = URL.createObjectURL(file)
    const loader = new THREE.TextureLoader()
    loader.load(
      url,
      (tex) => {
        tex.flipY = false
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        tex.repeat.set(1, 1)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.generateMipmaps = true
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.anisotropy = 4
        tex.needsUpdate = true
        setTexture(tex)
        setTextureUrl(url)
        setUploading(false)
      },
      undefined,
      () => { setError('Failed to load texture.'); setUploading(false) }
    )
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) loadTexture(file)
  }

  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) loadTexture(file)
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <p className="font-mono text-xs tracking-[0.18em] text-chrome/35">UPLOAD TEXTURE</p>

      {/* Drop zone */}
      <motion.div
        className={`relative border-2 border-dashed transition-all duration-300 rounded-sm overflow-hidden cursor-none ${
          isDragging ? 'border-acid bg-acid/5 scale-[1.02]' : 'border-smoke hover:border-chrome/15'
        }`}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        whileHover={{ borderColor: 'rgba(226,226,232,0.15)' }}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />

        <div className="p-8 flex flex-col items-center gap-4 text-center">
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="w-10 h-10 border-2 border-acid border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 flex items-center justify-center text-chrome/30 text-2xl border border-smoke"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
                >
                  ↑
                </div>
                <div>
                  <p className="font-body text-sm text-chrome/45 leading-snug">Drop image here</p>
                  <p className="font-body text-sm text-chrome/45">or <span className="text-acid">browse files</span></p>
                  <p className="font-mono text-xs text-chrome/20 mt-1">PNG · JPG · WebP — max {MAX_SIZE_MB}MB</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {isDragging && (
          <motion.div
            className="absolute inset-0 border-2 border-acid rounded-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: 'rgba(200,255,0,0.04)' }}
          />
        )}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div className="flex items-center gap-2 p-3 border border-ember/20 rounded-sm bg-ember/5"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <span className="text-ember text-sm">⚠</span>
            <span className="font-mono text-xs text-ember">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      <AnimatePresence>
        {textureUrl && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-2.5">PREVIEW</p>
            <div className="relative rounded-sm overflow-hidden aspect-square bg-smoke group">
              <img src={textureUrl} alt="Texture preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <button
                onClick={(e) => { e.stopPropagation(); clearTexture() }}
                className="absolute top-2 right-2 w-8 h-8 rounded-sm bg-void/90 flex items-center justify-center font-mono text-xs text-chrome/40 hover:text-ember transition-colors border border-smoke opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
              <span className="font-mono text-xs text-acid">Texture applied to model</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="p-4 rounded-sm border border-acid/10 bg-acid/3">
        <p className="font-mono text-[0.65rem] text-chrome/30 leading-relaxed">
          <span className="text-acid">PRO TIP —</span> Use 1:1 square images for seamless tiling. High-contrast designs on transparent backgrounds work best.
        </p>
      </div>
    </motion.div>
  )
}
