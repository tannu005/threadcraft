// src/pages/Home.jsx — Premium cinematic landing page
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import HeroCanvas from '../components/HeroCanvas'
import Magnetic from '../components/Magnetic'

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = parseInt(value)
    const duration = 1600
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}
function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '38%'])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97])

  const words = ['DESIGN.', 'GENERATE.', 'WEAR.']
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 cursor-none" data-cursor="drag">
        <HeroCanvas />
      </div>

      {/* Parallax layered background */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        {/* Large acid orb */}
        <div
          className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #c8ff00 0%, transparent 70%)' }}
        />
        {/* Ice orb */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)' }}
        />
        {/* Ember accent */}
        <div
          className="absolute top-3/4 left-1/5 w-[300px] h-[300px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #ff4d00 0%, transparent 60%)' }}
        />
      </motion.div>

      {/* Fine grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,255,0,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,255,0,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Diagonal scan line */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(200,255,0,0.08), transparent)',
          animation: 'scan 10s linear infinite',
          top: '30%',
        }}
      />

      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-16"
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <div className="w-8 h-px bg-acid" />
          <span className="font-mono text-xs tracking-[0.25em] text-acid uppercase">AI-Powered 3D Customizer</span>
          <div className="px-2 py-0.5 border border-acid/25 bg-acid/5 rounded-sm">
            <span className="font-mono text-[0.6rem] text-acid">v2.0</span>
          </div>
        </motion.div>

        {/* Main headline — staggered reveal */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-display text-[clamp(3.5rem,13vw,13rem)] leading-[0.88] text-white"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 1.0 }}
          >
            CREATE
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-display text-[clamp(3.5rem,13vw,13rem)] leading-[0.88]"
            style={{ WebkitTextStroke: '1px rgba(226,226,232,0.22)', color: 'transparent' }}
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 1.1 }}
          >
            YOUR
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-12">
          <motion.h1
            className="font-display text-[clamp(3.5rem,13vw,13rem)] leading-[0.88] text-gradient-acid"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1], delay: 1.2 }}
          >
            VISION
          </motion.h1>
        </div>

        {/* Sub copy + CTA */}
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-20"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="max-w-sm">
            <p className="text-chrome/45 font-body leading-relaxed text-base md:text-lg mb-4">
              Design custom products in real-time 3D. Upload artwork, generate AI textures, see everything come alive instantly.
            </p>
            {/* Stats row */}
            <div className="flex items-center gap-5">
              <div className="stat-badge">
                <span>10K+</span>
                <span className="text-chrome/30">Designs</span>
              </div>
              <div className="stat-badge">
                <span>4.9★</span>
                <span className="text-chrome/30">Rated</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Magnetic>
              <Link to="/customizer">
                <motion.button
                  className="btn-primary text-sm px-8 py-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>START DESIGNING</span>
                </motion.button>
              </Link>
            </Magnetic>
            <Magnetic>
              <button className="btn-outline text-sm px-7 py-3.5">
                WATCH DEMO
              </button>
            </Magnetic>
          </div>
        </motion.div>

        {/* Cycling word — bottom right */}
        <motion.div
          className="absolute bottom-16 right-6 md:right-10 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <p className="font-mono text-[0.6rem] tracking-[0.2em] text-chrome/20 mb-1">POWERED BY AI</p>
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              className="font-display text-4xl md:text-5xl text-white/8"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              {words[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <motion.div
          className="w-px h-14 bg-gradient-to-b from-acid to-transparent"
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="font-mono text-[0.58rem] tracking-[0.3em] text-chrome/20">SCROLL</span>
      </motion.div>
    </section>
  )
}

// ─── Section: Marquee ─────────────────────────────────────────────────────────
function MarqueeSection() {
  const items = ['3D VISUALIZATION', 'AI TEXTURE GENERATION', 'REAL-TIME PREVIEW', 'CUSTOM UPLOAD', 'ORBIT CONTROLS', 'PREMIUM HDRI', 'INSTANT SHARE', 'DALL·E 3']
  const doubled = [...items, ...items]

  return (
    <section className="py-5 overflow-hidden border-y border-smoke/60 relative">
      {/* Top fade */}
      <div className="absolute inset-y-0 left-0 w-20 z-10"
        style={{ background: 'linear-gradient(90deg, var(--void), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-20 z-10"
        style={{ background: 'linear-gradient(-90deg, var(--void), transparent)' }} />

      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="font-display-alt text-xl tracking-[0.2em] px-8 text-chrome/18 whitespace-nowrap">
            {item} <span className="text-acid/60">✦</span>
          </span>
        ))}
      </div>
    </section>
  )
}

// ─── Section: Features ────────────────────────────────────────────────────────
function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const features = [
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
          <path d="M16 4l10 5.5v11L16 26 6 20.5v-11L16 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 4v22M6 9.5l10 6 10-6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      ),
      title: 'Real-Time 3D',
      desc: 'Interactive product visualization with premium orbit controls, zoom, and cinematic lighting rigs.',
      accent: '#c8ff00',
      delay: 0,
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
          <path d="M16 6l2.5 6L25 14l-6.5 2.5L16 23l-2.5-6.5L7 14l6.5-1.5L16 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M24 20l1.5 3.5L29 25l-3.5 1.5L24 30l-1.5-3.5L19 25l3.5-1.5L24 20z" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        </svg>
      ),
      title: 'AI Generation',
      desc: 'Generate unique textures and patterns with DALL·E 3. Streetwear, luxury, cyber — your creative call.',
      accent: '#00f0ff',
      delay: 0.1,
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
          <rect x="4" y="8" width="24" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 8V6a1 1 0 011-1h8a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 14v6M13 17l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'Custom Upload',
      desc: 'Upload your logos, artwork, and textures. Applied instantly with GPU-accelerated texture mapping.',
      accent: '#ff4d00',
      delay: 0.2,
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
          <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 6l-3-3M24 6l3-3" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'Share & Save',
      desc: 'Capture your design as a high-res PNG and share directly to social media in one click.',
      accent: '#c8ff00',
      delay: 0.3,
    },
  ]

  return (
    <section ref={ref} className="py-28 px-6 md:px-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-20"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-label mb-5">FEATURES</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9]">
            EVERY TOOL<br />
            <span style={{ WebkitTextStroke: '1px rgba(226,226,232,0.2)', color: 'transparent' }}>
              YOU NEED
            </span>
          </h2>
          <p className="max-w-xs text-chrome/40 font-body text-sm leading-relaxed md:pb-2">
            A complete creative studio packed into your browser. No downloads, no subscriptions — just pure creative freedom.
          </p>
        </div>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="feature-card glass p-7 group cursor-none"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: f.delay }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(circle at 20% 20%, ${f.accent}0a 0%, transparent 65%)` }}
            />

            {/* Icon */}
            <div className="mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1"
              style={{ color: f.accent }}>
              {f.icon}
            </div>

            {/* Accent line */}
            <div className="w-8 h-px mb-4 transition-all duration-500 group-hover:w-16"
              style={{ background: f.accent, opacity: 0.6 }} />

            <h3 className="font-display text-xl tracking-tight text-white mb-2.5">{f.title}</h3>
            <p className="text-chrome/38 text-sm leading-relaxed font-body">{f.desc}</p>

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute top-0 right-0 w-3 h-px" style={{ background: f.accent }} />
              <div className="absolute top-0 right-0 w-px h-3" style={{ background: f.accent }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Section: Stats ───────────────────────────────────────────────────────────
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const stats = [
    { value: '10000', suffix: '+', label: 'Designs Created' },
    { value: '98', suffix: '%', label: 'Satisfaction Rate' },
    { value: '5', suffix: 'x', label: 'Faster than Photoshop' },
    { value: '50', suffix: '+', label: 'AI Style Presets' },
  ]

  return (
    <section ref={ref} className="py-16 px-6 md:px-10 relative">
      <div className="max-w-7xl mx-auto">
        <div className="divider mb-16" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-smoke">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center py-4 md:px-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <div className="font-display text-5xl md:text-6xl text-white mb-2">
                {isInView && <AnimatedNumber value={s.value} suffix={s.suffix} />}
              </div>
              <p className="font-mono text-xs tracking-[0.15em] text-chrome/30">{s.label.toUpperCase()}</p>
            </motion.div>
          ))}
        </div>
        <div className="divider mt-16" />
      </div>
    </section>
  )
}

// ─── Section: Process ─────────────────────────────────────────────────────────
function ProcessSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const steps = [
    {
      num: '01',
      title: 'Choose Your Base',
      desc: 'Select from our premium 3D product models — T-shirts, hoodies, and more arriving soon.',
      icon: '◈',
    },
    {
      num: '02',
      title: 'Design & Generate',
      desc: 'Pick colors, upload your artwork, or use AI to generate stunning patterns in seconds.',
      icon: '⬡',
    },
    {
      num: '03',
      title: 'Preview in 3D',
      desc: 'Rotate, zoom, and inspect every angle in real-time 3D with cinematic lighting.',
      icon: '◉',
    },
    {
      num: '04',
      title: 'Save & Share',
      desc: 'Capture your creation and share it with the world. Export high-res renders instantly.',
      icon: '⇗',
    },
  ]

  return (
    <section ref={ref} className="py-28 px-6 md:px-10 max-w-7xl mx-auto">
      <motion.div
        className="mb-20"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-label mb-5">PROCESS</div>
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9]">
          HOW IT <span className="text-gradient-acid">WORKS</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-acid/20 to-transparent pointer-events-none" />

        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="relative p-8 border-b md:border-b-0 md:border-r border-smoke/50 last:border-0 group"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
          >
            {/* Number */}
            <div className="counter-number text-7xl mb-6">{step.num}</div>

            {/* Icon dot */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 flex items-center justify-center border border-acid/20 bg-acid/5 text-acid text-base transition-all duration-300 group-hover:border-acid/40 group-hover:bg-acid/10"
                style={{ clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))' }}
              >
                {step.icon}
              </div>
              {/* Arrow to next step */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-center text-acid/20 text-xs tracking-widest absolute top-14 -right-3 z-10">→</div>
              )}
            </div>

            <h3 className="font-display text-xl tracking-tight text-white mb-3 group-hover:text-acid/90 transition-colors duration-300">
              {step.title}
            </h3>
            <p className="text-chrome/35 text-sm leading-relaxed">{step.desc}</p>

            {/* Hover glow */}
            <div className="absolute bottom-0 left-8 right-8 h-px bg-acid/0 group-hover:bg-acid/20 transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─── Section: Tech Showcase ───────────────────────────────────────────────────
function TechSection() {
  const tech = [
    { label: 'Three.js', desc: 'WebGL 3D rendering', color: '#c8ff00' },
    { label: 'React Three Fiber', desc: 'R3F scene graph', color: '#00f0ff' },
    { label: 'DALL·E 3', desc: 'AI image gen', color: '#ff4d00' },
    { label: 'Framer Motion', desc: 'Fluid animations', color: '#c8ff00' },
    { label: 'HDRI Lighting', desc: 'Cinema-grade env', color: '#00f0ff' },
    { label: 'GPU Particles', desc: 'Instanced rendering', color: '#ff4d00' },
  ]

  return (
    <section className="py-24 px-6 md:px-10 bg-ash/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="section-label mb-4">BUILT WITH</div>
          <h2 className="font-display text-4xl md:text-5xl text-white">PREMIUM TECH STACK</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tech.map((t, i) => (
            <motion.div
              key={t.label}
              className="glass p-4 rounded-sm group hover:border-acid/15 transition-all duration-300 cursor-none"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -3 }}
            >
              <div className="w-2 h-2 rounded-full mb-3" style={{ background: t.color, boxShadow: `0 0 8px ${t.color}60` }} />
              <p className="font-display text-sm text-white mb-1">{t.label}</p>
              <p className="font-mono text-[0.6rem] text-chrome/30">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Section: CTA ─────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-32 px-6 md:px-10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(200,255,0,0.04) 0%, transparent 60%)' }}
        />
        {/* Grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,255,0,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,255,0,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-acid/30" />
            <span className="font-mono text-xs tracking-[0.25em] text-acid">START NOW</span>
            <div className="w-12 h-px bg-acid/30" />
          </div>

          <h2 className="font-display text-6xl md:text-9xl text-white leading-[0.88] mb-6">
            READY TO<br />
            <span className="text-gradient-acid">CREATE?</span>
          </h2>

          <p className="text-chrome/35 mb-12 max-w-md mx-auto font-body leading-relaxed text-base">
            Join thousands of designers and artists using THREADCRAFT to bring their visions to life in stunning 3D.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <Link to="/customizer">
                <motion.button
                  className="btn-primary text-base px-12 py-5"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>LAUNCH CUSTOMIZER</span>
                </motion.button>
              </Link>
            </Magnetic>
            <p className="font-mono text-xs text-chrome/25">Free to use · No signup required</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-smoke/60 px-6 md:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 flex items-center justify-center bg-acid flex-shrink-0"
              style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-3.5 h-3.5">
                <path d="M10 2L4 5.5v4c0 3.9 2.5 7.5 6 8.6 3.5-1.1 6-4.7 6-8.6v-4L10 2z" fill="#06060a" />
              </svg>
            </div>
            <div>
              <p className="font-display text-base tracking-tight text-white">THREADCRAFT</p>
              <p className="font-mono text-[0.55rem] tracking-widest text-chrome/25">AI PRODUCT CUSTOMIZER</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-8">
            {[
              { label: 'Gallery', href: '#' },
              { label: 'About', href: '#' },
              { label: 'Pricing', href: '#' },
              { label: 'Privacy', href: '#' },
              { label: 'Terms', href: '#' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className="font-mono text-xs tracking-wider text-chrome/25 hover:text-acid transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="font-mono text-xs text-chrome/15 tracking-widest">
            © 2025 THREADCRAFT — ALL RIGHTS RESERVED
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
            <span className="font-mono text-xs text-chrome/20 tracking-wider">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Page export ──────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="min-h-screen bg-void">
      <Loader onComplete={() => setLoaded(true)} />

      <AnimatePresence>
        {loaded && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Navbar />
            <HeroSection />
            <MarqueeSection />
            <FeaturesSection />
            <StatsSection />
            <ProcessSection />
            <TechSection />
            <CTASection />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
