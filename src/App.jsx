// src/App.jsx
import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import GrainOverlay from './components/GrainOverlay'
import Loader from './components/Loader'

const Home = lazy(() => import('./pages/Home'))
const Customizer = lazy(() => import('./pages/Customizer'))

export default function App() {
  const location = useLocation()

  return (
    <div className="relative">
      <CustomCursor />
      <GrainOverlay />

      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/customizer" element={<Customizer />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </Suspense>
    </div>
  )
}
