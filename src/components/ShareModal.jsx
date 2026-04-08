// src/components/ShareModal.jsx — Premium share modal
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useStore from '../context/store'

export default function ShareModal({ canvasRef }) {
  const { setShowShare } = useStore()
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const capture = () => {
    if (!canvasRef?.current) return
    const canvas = canvasRef.current.querySelector('canvas')
    if (!canvas) return
    setDownloading(true)
    try {
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `threadcraft-design-${Date.now()}.png`
      a.click()
    } finally {
      setTimeout(() => setDownloading(false), 800)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      label: 'TWITTER / X',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?text=Just created this custom design on THREADCRAFT!&url=${encodeURIComponent(window.location.href)}`,
      color: '#1da1f2',
    },
    {
      label: 'INSTAGRAM',
      icon: '◎',
      href: '#',
      color: '#e1306c',
      note: 'Download & post manually',
    },
  ]

  return (
    <motion.div
      className="modal-overlay"
      onClick={() => setShowShare(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="glass rounded-sm p-7 w-full max-w-sm mx-4 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--acid), transparent)' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl tracking-tight text-white">SHARE YOUR DESIGN</h2>
            <p className="font-mono text-xs text-chrome/30 mt-0.5">Export or share your creation</p>
          </div>
          <button
            onClick={() => setShowShare(false)}
            className="btn-icon w-8 h-8 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Download PNG */}
        <button
          className={`w-full btn-primary mb-3 flex items-center justify-center gap-2 ${downloading ? 'opacity-70' : ''}`}
          onClick={capture}
          disabled={downloading}
        >
          {downloading ? (
            <div className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
          ) : '↓'}
          <span>{downloading ? 'SAVING…' : 'DOWNLOAD PNG'}</span>
        </button>

        {/* Copy link */}
        <button
          className="w-full btn-outline mb-5 flex items-center justify-center gap-2 text-sm py-3"
          onClick={copyLink}
        >
          <span>{copied ? '✓ COPIED!' : '⇗ COPY LINK'}</span>
        </button>

        <div className="divider mb-5" />

        {/* Social links */}
        <p className="font-mono text-xs tracking-[0.15em] text-chrome/25 mb-3">SHARE ON SOCIAL</p>
        <div className="space-y-2">
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 rounded-sm glass-light hover:border-acid/15 transition-all duration-200 group"
            >
              <span className="text-lg w-7 text-center text-chrome/35 group-hover:text-acid transition-colors">{link.icon}</span>
              <div>
                <span className="font-mono text-xs tracking-widest text-chrome/45 group-hover:text-chrome/70 transition-colors block">{link.label}</span>
                {link.note && <span className="font-mono text-[0.55rem] text-chrome/20">{link.note}</span>}
              </div>
              <span className="ml-auto text-chrome/20 group-hover:text-acid/50 transition-colors text-xs">→</span>
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
