// src/components/SmoothScroll.jsx
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothHorizontal: false,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Handle scroll to top on route change
    lenis.scrollTo(0, { immediate: true })

    return () => {
      lenis.destroy()
    }
  }, [location.pathname])

  return <>{children}</>
}
