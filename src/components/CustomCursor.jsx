// src/components/CustomCursor.jsx — Premium magnetic cursor
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)
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
      cursor.style.left = pos.current.x + 'px'
      cursor.style.top = pos.current.y + 'px'

      // Follower lags behind with lerp
      followerPos.current.x += (pos.current.x - followerPos.current.x) * 0.12
      followerPos.current.y += (pos.current.y - followerPos.current.y) * 0.12
      follower.style.left = followerPos.current.x + 'px'
      follower.style.top = followerPos.current.y + 'px'

      rafRef.current = requestAnimationFrame(animate)
    }

    const onEnter = () => {
      cursor.classList.add('cursor-hover')
      follower.classList.add('cursor-follower-hover')
    }
    const onLeave = () => {
      cursor.classList.remove('cursor-hover')
      follower.classList.remove('cursor-follower-hover')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    // Interactive elements
    const interactables = document.querySelectorAll('a, button, [data-cursor]')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
