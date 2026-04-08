// src/components/Navbar.jsx — Premium sticky nav with ambient glow
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isCustomizer = location.pathname === '/customizer'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = ['Gallery', 'About', 'Pricing']

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500 ${
          scrolled ? 'glass border-b border-white/5' : ''
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Logo mark */}
          <div className="relative w-8 h-8">
            <div
              className="w-8 h-8 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(200,255,0,0.4)]"
              style={{
                background: 'var(--acid)',
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                <path d="M10 2L4 5.5v4c0 3.9 2.5 7.5 6 8.6 3.5-1.1 6-4.7 6-8.6v-4L10 2z" fill="#06060a" />
                <path d="M7 9.5l2 2 4-4" stroke="#c8ff00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-tight text-white">THREADCRAFT</span>
            <span className="font-mono text-[0.5rem] tracking-[0.2em] text-acid/70 uppercase">AI Customizer</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => (
            <motion.a
              key={item}
              href="#"
              className="relative font-mono text-xs tracking-widest text-chrome/40 hover:text-chrome transition-colors duration-200 group"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-acid transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          {!isCustomizer ? (
            <Link to="/customizer">
              <button className="btn-primary text-sm px-6 py-3">
                <span>DESIGN NOW</span>
              </button>
            </Link>
          ) : (
            <Link to="/">
              <button className="btn-outline text-xs px-5 py-2.5">← HOME</button>
            </Link>
          )}
        </motion.div>
      </motion.nav>
    </>
  )
}
