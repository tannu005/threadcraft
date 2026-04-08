// src/components/Loader.jsx — Premium cinematic loader
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [phase, setPhase] = useState(0) // 0: loading, 1: reveal

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 6 + 2
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(() => setPhase(1), 300)
          setTimeout(() => { setDone(true); onComplete?.() }, 1200)
          return 100
        }
        return next
      })
    }, 55)
    return () => clearInterval(interval)
  }, [])

  const letters = 'THREADCRAFT'.split('')

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void overflow-hidden"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-px opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--acid), transparent)',
              animation: 'scan 3s linear infinite',
            }}
          />

          {/* Background radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,255,0,0.03) 0%, transparent 60%)' }}
          />

          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: 'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />

          {/* Logo letter stagger */}
          <div className="flex items-center gap-0 mb-10 overflow-hidden">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                className="font-display text-5xl md:text-7xl text-white"
                style={{ letterSpacing: '-0.02em' }}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.1 + i * 0.04
                }}
              >
                {letter === 'A' && i === 6 ? (
                  <span className="text-acid">{letter}</span>
                ) : letter}
              </motion.span>
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            className="font-mono text-xs tracking-[0.3em] text-chrome/30 mb-10 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            AI Product Customizer
          </motion.p>

          {/* Progress container */}
          <motion.div
            className="w-72 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Track */}
            <div className="h-px bg-smoke relative overflow-hidden mb-3">
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: 'linear-gradient(90deg, var(--acid), var(--ice))',
                  boxShadow: '0 0 12px rgba(200,255,0,0.6)',
                  transition: 'width 0.1s ease',
                }}
              />
              {/* Shimmer on bar */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 1.5s linear infinite',
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-chrome/20 tracking-widest">
                {progress < 30 ? 'INITIALIZING' : progress < 60 ? 'LOADING ASSETS' : progress < 85 ? 'PREPARING 3D' : 'READY'}
              </span>
              <span className="font-mono text-xs text-acid tracking-widest">
                {Math.min(Math.floor(progress), 100).toString().padStart(3, '0')}%
              </span>
            </div>
          </motion.div>

          {/* Phase transition overlay */}
          <AnimatePresence>
            {phase === 1 && (
              <motion.div
                className="absolute inset-0 bg-acid"
                initial={{ scaleY: 0, transformOrigin: 'bottom' }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0, transformOrigin: 'top' }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
