// src/components/panels/DecalPanel.jsx — Premium decal management
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import useStore from '../../context/store'

export default function DecalPanel() {
  const { decals, addDecal, removeDecal, updateDecal, clearDecals } = useStore()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef()

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const url = event.target.result
      
      // Load texture
      const loader = new THREE.TextureLoader()
      loader.load(url, (texture) => {
        const id = Math.random().toString(36).substr(2, 9)
        addDecal({
          id,
          url,
          texture,
          position: [0, 0, 0.15],
          rotation: [0, 0, 0],
          scale: [1.2, 1.2, 1.2],
        })
        setIsUploading(false)
      })
    }
    reader.readAsDataURL(file)
  }

  const [textValue, setTextValue] = useState('')
  const [selectedFont, setSelectedFont] = useState('Syne')

  const handleAddText = () => {
    if (!textValue.trim()) return
    const id = Math.random().toString(36).substr(2, 9)
    addDecal({
      id,
      type: 'text',
      text: textValue,
      font: selectedFont,
      textColor: '#ffffff',
      position: [0, 0, 0.15],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    })
    setTextValue('')
  }

  const FONTS = ['Syne', 'Bebas Neue', 'JetBrains Mono', 'Outfit', 'Inter']

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-4">ADD LOGO</p>
          <div 
            className="border-2 border-dashed border-white/5 hover:border-acid/20 rounded-sm p-8 text-center cursor-none transition-colors duration-300"
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*"
            />
            <div className="text-acid/40 text-2xl mb-2">+</div>
            <p className="font-display text-[0.65rem] tracking-widest text-chrome/40 uppercase">UPLOAD IMAGE</p>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-4">ADD TEXT</p>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="TYPE YOUR MESSAGE..." 
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="prompt-input w-full"
            />
            <div className="flex gap-2">
              <select 
                className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-2 font-mono text-[0.6rem] text-chrome uppercase tracking-widest outline-none focus:border-acid/30"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
              >
                {FONTS.map(f => <option key={f} value={f} className="bg-void">{f}</option>)}
              </select>
              <button 
                className="btn-primary px-6 py-2 text-[0.65rem]"
                onClick={handleAddText}
              >
                ADD
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {decals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 uppercase">ACTIVE DECALS</p>
              <button 
                className="font-mono text-[0.6rem] text-ember/60 hover:text-ember transition-colors"
                onClick={clearDecals}
              >
                CLEAR ALL
              </button>
            </div>

            <div className="space-y-3">
              {decals.map((decal) => (
                <div 
                  key={decal.id} 
                  className="p-3 bg-white/3 border border-white/5 rounded-sm space-y-3"
                >
                  <div className="flex items-center gap-3">
                    {decal.type === 'text' ? (
                      <div className="w-10 h-10 bg-black/20 rounded-sm flex items-center justify-center font-display text-[0.6rem] text-acid">
                        Aa
                      </div>
                    ) : (
                      <img src={decal.url} className="w-10 h-10 object-contain bg-black/20 rounded-sm" />
                    )}
                    <div className="flex-1">
                      <p className="font-mono text-[0.6rem] text-chrome/40 uppercase truncate">
                        {decal.type === 'text' ? decal.text : `DECAL_${decal.id.substr(0,4)}`}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-chrome/20 hover:text-acid transition-colors"
                        onClick={() => updateDecal(decal.id, { position: [0, 0, 0.15], scale: [1.2, 1.2, 1.2] })}
                        title="Reset position & scale"
                      >
                        ↺
                      </button>
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-chrome/20 hover:text-ember transition-colors"
                        onClick={() => removeDecal(decal.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-2">
                    {/* Scale Slider */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-mono text-[0.55rem] text-chrome/30 uppercase">ZOOM / SCALE</span>
                        <span className="font-mono text-[0.55rem] text-acid">{(decal.scale[0] * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" min="0.1" max="3" step="0.05"
                        value={decal.scale[0]}
                        onChange={(e) => {
                          const s = parseFloat(e.target.value)
                          updateDecal(decal.id, { scale: [s, s, s] })
                        }}
                        className="w-full h-1 bg-white/5 rounded-full accent-acid"
                      />
                    </div>

                    {/* Position Sliders */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-[0.55rem] text-chrome/30 uppercase">X POS</span>
                        </div>
                        <input 
                          type="range" min="-1.2" max="1.2" step="0.01"
                          value={decal.position[0]}
                          onChange={(e) => {
                            const x = parseFloat(e.target.value)
                            updateDecal(decal.id, { position: [x, decal.position[1], decal.position[2]] })
                          }}
                          className="w-full h-1 bg-white/5 rounded-full accent-acid"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-mono text-[0.55rem] text-chrome/30 uppercase">Y POS</span>
                        </div>
                        <input 
                          type="range" min="-1.5" max="1.5" step="0.01"
                          value={decal.position[1]}
                          onChange={(e) => {
                            const y = parseFloat(e.target.value)
                            updateDecal(decal.id, { position: [decal.position[0], y, decal.position[2]] })
                          }}
                          className="w-full h-1 bg-white/5 rounded-full accent-acid"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text Color Control (Only for text decals) */}
                  {decal.type === 'text' && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-[0.55rem] text-chrome/30 uppercase">TEXT COLOR</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={decal.textColor || '#ffffff'} 
                          onChange={(e) => updateDecal(decal.id, { textColor: e.target.value })}
                          className="w-4 h-4 bg-transparent border-none cursor-pointer p-0"
                        />
                        <span className="font-mono text-[0.55rem] text-chrome/50 uppercase">{decal.textColor || '#ffffff'}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 border border-acid/10 bg-acid/5 rounded-sm">
        <div className="flex gap-3">
          <div className="text-acid text-sm">✦</div>
          <div>
            <p className="font-display text-[0.65rem] text-acid tracking-widest uppercase mb-1">PRO TIP</p>
            <p className="font-body text-[0.7rem] text-chrome/40 leading-relaxed">
              Use transparent PNGs for the best results. Decals wrap dynamically around the 3D geometry of the shirt.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
