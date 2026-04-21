// src/pages/Customizer.jsx — Premium customizer layout
import { useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Scene from '../components/Scene'
import ShareModal from '../components/ShareModal'
import useStore from '../context/store'

// ─── Toolbar ──────────────────────────────────────────────────────────────────
function Toolbar({ canvasRef }) {
  const { autoRotate, setAutoRotate, setShowShare, clearTexture, color, textureUrl } = useStore()

  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-smoke bg-ash/80 backdrop-blur-sm flex-shrink-0">
      {/* Left: status */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-acid" />
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-acid animate-ping opacity-40" />
        </div>
        <span className="font-mono text-xs tracking-widest text-chrome/35 truncate">
          CLASSIC T-SHIRT — LIVE
        </span>
        {textureUrl && (
          <span className="hidden md:flex items-center gap-1.5 px-2 py-0.5 border border-acid/20 rounded-sm bg-acid/5">
            <div className="w-1.5 h-1.5 rounded-full bg-acid" />
            <span className="font-mono text-[0.6rem] text-acid">TEXTURE ACTIVE</span>
          </span>
        )}
      </div>

      {/* Center: color chip */}
      <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 border border-smoke rounded-sm bg-void/50">
        <div
          className="w-3.5 h-3.5 rounded-full border border-white/10 flex-shrink-0"
          style={{ background: color, boxShadow: `0 0 8px ${color}44` }}
        />
        <span className="font-mono text-xs text-chrome/30 uppercase tracking-wide">{color}</span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        <button
          className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-sm border transition-all duration-200 ${
            autoRotate
              ? 'border-acid/40 text-acid bg-acid/6'
              : 'border-smoke text-chrome/30 hover:border-chrome/20 hover:text-chrome/50'
          }`}
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle auto-rotate"
        >
          <span className={`text-base transition-transform ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>↻</span>
          <span className="hidden sm:inline">ROTATE</span>
        </button>

        <button
          className="btn-icon text-xs"
          onClick={clearTexture}
          title="Clear texture"
        >
          ✕
        </button>

        <button
          className="btn-primary text-xs px-5 py-2"
          onClick={() => setShowShare(true)}
        >
          <span>SHARE</span>
        </button>
      </div>
    </div>
  )
}

// ─── Canvas loading fallback ──────────────────────────────────────────────────
function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-void">
      <div className="relative">
        <div className="w-12 h-12 border border-smoke rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-t border-acid rounded-full animate-spin" />
        <div className="absolute inset-2 w-8 h-8 border-t border-ice/40 rounded-full animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }} />
      </div>
      <div className="text-center">
        <p className="font-mono text-xs tracking-widest text-chrome/30 mb-1">LOADING 3D SCENE</p>
        <p className="font-mono text-[0.6rem] text-chrome/15">Preparing WebGL renderer…</p>
      </div>
    </div>
  )
}

// ─── Canvas interaction hints ─────────────────────────────────────────────────
function CanvasHints() {
  return (
    <motion.div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay: 2 }}
    >
      {[
        { icon: '⟳', label: 'DRAG TO ROTATE' },
        { icon: '⊕', label: 'SCROLL TO ZOOM' },
      ].map((hint) => (
        <div key={hint.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/5">
          <span className="text-chrome/40 text-sm">{hint.icon}</span>
          <span className="font-mono text-[0.58rem] tracking-widest text-chrome/35">{hint.label}</span>
        </div>
      ))}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Customizer() {
  const canvasRef = useRef(null)
  const { showShare } = useStore()

  return (
    <motion.div
      className="h-screen flex flex-col bg-void overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-[60px]">
        {/* ── Sidebar ── */}
        <motion.div
          className="w-72 flex-shrink-0 border-r border-smoke flex flex-col overflow-hidden"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        >
          {/* Sidebar header */}
          <div className="px-5 py-4 border-b border-smoke flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-sm tracking-wide text-white">CUSTOMIZE</p>
                <p className="font-mono text-[0.6rem] tracking-widest text-chrome/30 mt-0.5">Color · Texture · AI Generate</p>
              </div>
              <div className="w-6 h-6 flex items-center justify-center border border-acid/20 rounded-sm bg-acid/5">
                <span className="text-acid text-xs">✦</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <Sidebar />
          </div>
        </motion.div>

        {/* ── Canvas area ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Toolbar canvasRef={canvasRef} />

          <div ref={canvasRef} className="flex-1 relative cursor-none" data-cursor="drag">
            <Suspense fallback={<CanvasLoader />}>
              <Scene />
            </Suspense>
            <CanvasHints />

            {/* Premium vignette */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(6,6,10,0.7) 100%)' }}
            />

            {/* Corner brackets */}
            {[
              'top-3 left-3 border-t border-l',
              'top-3 right-3 border-t border-r',
              'bottom-3 left-3 border-b border-l',
              'bottom-3 right-3 border-b border-r',
            ].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 border-acid/20 pointer-events-none ${cls}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Share modal */}
      <AnimatePresence>
        {showShare && <ShareModal canvasRef={canvasRef} />}
      </AnimatePresence>
    </motion.div>
  )
}
