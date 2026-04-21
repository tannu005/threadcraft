// src/components/panels/DecalPanel.jsx — Premium decal management
import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import useStore from '../../context/store'

export default function DecalPanel() {
  const { decals, addDecal, removeDecal, clearDecals } = useStore()
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
          position: [0, 0.2, 0.13],
          rotation: [0, 0, 0],
          scale: [0.6, 0.6, 0.6],
        })
        setIsUploading(false)
      })
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-4">ADD ARTWORK</p>
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
          <p className="font-display text-[0.65rem] tracking-widest text-chrome/40 uppercase">UPLOAD LOGO</p>
          <p className="font-mono text-[0.55rem] text-chrome/20 mt-1">PNG, JPG, SVG supported</p>
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

            <div className="space-y-2">
              {decals.map((decal) => (
                <div 
                  key={decal.id} 
                  className="flex items-center gap-3 p-2 bg-white/3 border border-white/5 rounded-sm"
                >
                  <img src={decal.url} className="w-10 h-10 object-contain bg-black/20 rounded-sm" />
                  <div className="flex-1">
                    <p className="font-mono text-[0.6rem] text-chrome/40 uppercase truncate">DECAL_{decal.id.substr(0,4)}</p>
                    <div className="flex gap-2 mt-1">
                      {/* Placeholder for scale/pos controls */}
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-acid/30" />
                      </div>
                    </div>
                  </div>
                  <button 
                    className="w-6 h-6 flex items-center justify-center text-chrome/20 hover:text-ember transition-colors"
                    onClick={() => removeDecal(decal.id)}
                  >
                    ×
                  </button>
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
