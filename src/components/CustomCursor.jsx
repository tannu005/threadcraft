// src/components/CustomCursor.jsx — Premium magnetic cursor
import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [cursorType, setCursorType] = useState('default')
  
  const pos = useRef({ x: -100, y: -100 })
  const followerPos = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const animate = () => {
      // Cursor follows mouse exactly
      if (cursor) {
        cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
      }

      // Follower lags behind with lerp
      if (follower) {
        followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.15
        followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.15
        follower.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const onEnter = (e) => {
      const type = e.currentTarget.getAttribute('data-cursor')
      setCursorType(type || 'hover')
      setIsHovered(true)
    }
    const onLeave = () => {
      setCursorType('default')
      setIsHovered(false)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    const updateInteractables = () => {
      const interactables = document.querySelectorAll('a, button, [data-cursor], .swatch, .feature-card')
      interactables.forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
      return interactables
    }

    let interactables = updateInteractables()

    const observer = new MutationObserver(() => {
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
      interactables = updateInteractables()
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`cursor-dot ${isHovered ? 'scale-0' : 'scale-100'}`} 
      />
      <div 
        ref={followerRef} 
        className={`cursor-follower-main ${
          cursorType === 'drag' ? 'cursor-drag-state' : 
          isHovered ? 'cursor-hover-state' : ''
        }`}
      >
        {cursorType === 'drag' && <span className="text-[10px] font-bold text-void uppercase tracking-tighter">DRAG</span>}
        {cursorType === 'view' && <span className="text-[10px] font-bold text-void uppercase tracking-tighter">VIEW</span>}
      </div>
    </>
  )
}
