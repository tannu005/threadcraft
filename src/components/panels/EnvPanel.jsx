// src/components/panels/EnvPanel.jsx — Premium environment selector
import { motion } from 'framer-motion'
import useStore from '../../context/store'

const ENVIRONMENTS = [
  { id: 'studio', label: 'STUDIO', color: '#c8ff00', desc: 'Neutral, professional lighting' },
  { id: 'sunset', label: 'SUNSET', color: '#ff4d00', desc: 'Warm, golden hour glow' },
  { id: 'forest', label: 'FOREST', color: '#52b788', desc: 'Natural, soft lighting' },
  { id: 'city', label: 'CITY', color: '#00f0ff', desc: 'Cool, urban atmosphere' },
  { id: 'night', label: 'NIGHT', color: '#8b5cf6', desc: 'Moody, low-light aesthetic' },
  { id: 'apartment', label: 'INTERIOR', color: '#f5c842', desc: 'Warm, indoor lighting' },
]

export default function EnvPanel() {
  const { environment, setEnvironment } = useStore()

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <p className="font-mono text-xs tracking-[0.18em] text-chrome/35 mb-4">ATMOSPHERE PRESETS</p>
        <div className="grid grid-cols-1 gap-2">
          {ENVIRONMENTS.map((env) => (
            <button
              key={env.id}
              className={`flex items-center gap-4 p-3 border rounded-sm transition-all duration-300 group ${
                environment === env.id 
                  ? 'border-acid/30 bg-acid/5' 
                  : 'border-white/5 bg-white/2 hover:border-white/10 hover:bg-white/4'
              }`}
              onClick={() => setEnvironment(env.id)}
            >
              <div 
                className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center border border-white/10"
                style={{ 
                  background: `linear-gradient(135deg, ${env.color}22 0%, transparent 100%)`,
                  boxShadow: environment === env.id ? `0 0 15px ${env.color}15` : 'none'
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: env.color }} />
              </div>
              
              <div className="text-left">
                <p className={`font-display text-[0.7rem] tracking-widest uppercase transition-colors ${
                  environment === env.id ? 'text-acid' : 'text-chrome/60 group-hover:text-chrome/80'
                }`}>
                  {env.label}
                </p>
                <p className="font-mono text-[0.55rem] text-chrome/25 mt-0.5">{env.desc}</p>
              </div>

              {environment === env.id && (
                <motion.div 
                  className="ml-auto w-1 h-1 rounded-full bg-acid"
                  layoutId="active-env"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border border-smoke bg-ash/50 rounded-sm">
        <p className="font-mono text-[0.6rem] text-chrome/20 uppercase mb-2">SCENE PROPERTIES</p>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem] text-chrome/40 uppercase">Global Illumination</span>
          <span className="font-mono text-[0.6rem] text-acid">ENABLED</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-mono text-[0.6rem] text-chrome/40 uppercase">Ray Tracing (Sim)</span>
          <span className="font-mono text-[0.6rem] text-acid">ACTIVE</span>
        </div>
      </div>
    </motion.div>
  )
}
