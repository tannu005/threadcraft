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

    const onEnter = (e) => {
      const type = e.currentTarget.getAttribute('data-cursor')
      if (type === 'drag') {
        cursor.classList.add('opacity-0')
        follower.classList.add('cursor-drag')
      } else {
        cursor.classList.add('cursor-hover')
        follower.classList.add('cursor-follower-hover')
      }
    }
    const onLeave = () => {
      cursor.classList.remove('cursor-hover', 'opacity-0')
      follower.classList.remove('cursor-follower-hover', 'cursor-drag')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    // Dynamic interaction listener
    const updateInteractables = () => {
      const interactables = document.querySelectorAll('a, button, [data-cursor], .swatch')
      interactables.forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
      return interactables
    }

    let interactables = updateInteractables()

    // Mutation observer to handle dynamic content
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
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
