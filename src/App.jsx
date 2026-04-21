// src/App.jsx
import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import GrainOverlay from './components/GrainOverlay'
import Loader from './components/Loader'

import Home from './pages/Home'
import Customizer from './pages/Customizer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'
import SmoothScroll from './components/SmoothScroll'

import DissolveTransition from './components/DissolveTransition'

export default function App() {
  const location = useLocation()

  return (
    <div className="relative">
      <CustomCursor />
      <GrainOverlay />
      
      <AnimatePresence mode="wait">
        <DissolveTransition key={`transition-${location.pathname}`} />
      </AnimatePresence>

      <SmoothScroll>
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
                animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
                exit: { opacity: 0, scale: 1.1, filter: 'blur(20px)' }
              }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/customizer" element={<Customizer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/work" element={<Work />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </SmoothScroll>
    </div>
  )
}
