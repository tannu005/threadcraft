// src/components/Sidebar.jsx — Premium sidebar with smooth tab transitions
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../context/store'
import ColorPanel from './panels/ColorPanel'
import TexturePanel from './panels/TexturePanel'
import AIPanel from './panels/AIPanel'
import DecalPanel from './panels/DecalPanel'
import EnvPanel from './panels/EnvPanel'

const TABS = [
  {
    id: 'color', label: 'COLOR',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 'texture', label: 'TEXTURE',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <rect x="3" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="3" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 'decals', label: 'DECALS',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2v4M10 14v4M2 10h4M14 10h4" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    )
  },
  {
    id: 'ai', label: 'AI GEN',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <path d="M10 3l1.5 3.5L15 8l-3.5 1.5L10 13l-1.5-3.5L5 8l3.5-1.5L10 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M15 13l1 2.5L18.5 16l-2.5 1L15 19.5l-1-2.5L11.5 16l2.5-1L15 13z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.6" />
      </svg>
    )
  },
  {
    id: 'environment', label: 'SCENE',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    )
  },
]

const PANEL_MAP = {
  color:       <ColorPanel />,
  texture:     <TexturePanel />,
  decals:      <DecalPanel />,
  ai:          <AIPanel />,
  environment: <EnvPanel />,
}

export default function Sidebar() {
  const { activeTab, setActiveTab } = useStore()

  return (
    <div className="flex h-full">
      {/* Tab rail */}
      <div className="w-[60px] flex flex-col items-center pt-3 border-r border-smoke bg-ash flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab w-full relative ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            {/* Active indicator dot */}
            {activeTab === tab.id && (
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-acid rounded-l-full"
                layoutId="tab-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="transition-transform duration-200 hover:scale-110">{tab.icon}</span>
            <span className="text-[0.52rem] tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto bg-ash panel-scroll">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="p-5"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {PANEL_MAP[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
