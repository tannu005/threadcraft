// src/App.jsx
import React, { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import CustomCursor from './components/CustomCursor'
import GrainOverlay from './components/GrainOverlay'
import Loader from './components/Loader'

const Home = lazy(() => import('./pages/Home'))
const Customizer = lazy(() => import('./pages/Customizer'))

export default function App() {
  const location = useLocation()

  return (
    <>
      <CustomCursor />
      <GrainOverlay />

      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/customizer" element={<Customizer />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}
