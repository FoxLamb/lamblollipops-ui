import { useEffect, useRef, useState, useCallback } from 'react'

export type TrailStyle = 'sparkles' | 'hearts' | 'lollipops' | 'rainbow' | 'off'

const TRAIL_PARTICLES: Record<Exclude<TrailStyle, 'off'>, string[]> = {
  sparkles: ['✨', '⭐', '✦', '★', '✧'],
  hearts: ['💖', '💗', '💕', '❤️', '💜'],
  lollipops: ['🍭', '🍬', '🍫', '🧁', '🍩'],
  rainbow: ['●', '●', '●', '●', '●'],
}

const RAINBOW_COLORS = ['#ff71ce', '#01cdfe', '#b967ff', '#fffb96', '#05ffa1']

const STYLE_LABELS: Record<TrailStyle, string> = {
  sparkles: '✨',
  hearts: '💖',
  lollipops: '🍭',
  rainbow: '🌈',
  off: '🚫',
}

const STYLE_ORDER: TrailStyle[] = ['sparkles', 'hearts', 'lollipops', 'rainbow', 'off']

const POOL_SIZE = 25
const STORAGE_KEY = 'cursorTrailStyle'

interface Particle {
  x: number
  y: number
  char: string
  color: string | null
  opacity: number
  vy: number
  life: number
  active: boolean
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(pointer: coarse)').matches
}

function getStoredStyle(): TrailStyle {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && STYLE_ORDER.includes(stored as TrailStyle)) {
      return stored as TrailStyle
    }
  } catch { /* localStorage unavailable */ }
  return 'sparkles'
}

export default function CursorTrail() {
  const [style, setStyle] = useState<TrailStyle>(getStoredStyle)
  const [isTouch, setIsTouch] = useState(true) // default true, flip on mount
  const particlesRef = useRef<Particle[]>([])
  const nextIndexRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastSpawnRef = useRef(0)

  // Detect touch on mount
  useEffect(() => {
    setIsTouch(isTouchDevice())
  }, [])

  // Initialize particle pool
  useEffect(() => {
    particlesRef.current = Array.from({ length: POOL_SIZE }, () => ({
      x: 0,
      y: 0,
      char: '',
      color: null,
      opacity: 0,
      vy: 0,
      life: 0,
      active: false,
    }))
  }, [])

  // Persist style to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, style)
    } catch { /* localStorage unavailable */ }
  }, [style])

  const cycleStyle = useCallback(() => {
    setStyle(prev => {
      const idx = STYLE_ORDER.indexOf(prev)
      return STYLE_ORDER[(idx + 1) % STYLE_ORDER.length]
    })
  }, [])

  // Main animation loop + mouse tracking
  useEffect(() => {
    if (isTouch || style === 'off') return

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      // Throttle spawns to ~30ms apart
      const now = performance.now()
      if (now - lastSpawnRef.current < 30) return
      lastSpawnRef.current = now

      const container = containerRef.current
      if (!container) return

      const pool = particlesRef.current
      const particle = pool[nextIndexRef.current]
      const el = container.children[nextIndexRef.current] as HTMLElement | undefined
      const chars = TRAIL_PARTICLES[style]
      const charIdx = Math.floor(Math.random() * chars.length)

      particle.x = e.clientX + (Math.random() - 0.5) * 16
      particle.y = e.clientY + (Math.random() - 0.5) * 16
      particle.char = chars[charIdx]
      particle.color = style === 'rainbow' ? RAINBOW_COLORS[charIdx] : null
      particle.opacity = 1
      particle.vy = 0.3 + Math.random() * 0.5
      particle.life = 1
      particle.active = true

      // Update DOM element content immediately on spawn
      if (el) {
        el.textContent = particle.char
        if (particle.color) {
          el.style.color = particle.color
        } else {
          el.style.color = ''
        }
      }

      nextIndexRef.current = (nextIndexRef.current + 1) % POOL_SIZE
    }

    const animate = () => {
      const container = containerRef.current
      if (!container) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      const children = container.children
      const pool = particlesRef.current

      for (let i = 0; i < POOL_SIZE; i++) {
        const p = pool[i]
        const el = children[i] as HTMLElement | undefined
        if (!el) continue

        if (p.active) {
          p.life -= 0.02
          p.opacity = Math.max(0, p.life)
          p.y += p.vy
          p.vy += 0.03 // gravity

          if (p.life <= 0) {
            p.active = false
            el.style.opacity = '0'
          } else {
            el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${0.5 + p.life * 0.5})`
            el.style.opacity = String(p.opacity)
          }
        } else {
          el.style.opacity = '0'
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isTouch, style])

  // Update particle chars when style changes (reset pool)
  useEffect(() => {
    particlesRef.current.forEach(p => {
      p.active = false
      p.life = 0
      p.opacity = 0
    })
  }, [style])

  if (isTouch) return null

  return (
    <>
      {/* Particle container */}
      <div ref={containerRef} className="cursor-trail-container" aria-hidden="true">
        {Array.from({ length: POOL_SIZE }, (_, i) => (
          <span key={i} className="cursor-trail-particle">
            {/* char set dynamically but we need initial content for layout */}
            {particlesRef.current[i]?.char || '✨'}
          </span>
        ))}
      </div>

      {/* Style toggle button */}
      {style !== 'off' ? (
        <button
          className="cursor-trail-toggle"
          onClick={cycleStyle}
          title={`Trail: ${style} (click to change)`}
          aria-label={`Cursor trail style: ${style}. Click to change.`}
        >
          {STYLE_LABELS[style]}
        </button>
      ) : (
        <button
          className="cursor-trail-toggle cursor-trail-toggle--off"
          onClick={cycleStyle}
          title="Trail off (click to enable)"
          aria-label="Cursor trail disabled. Click to enable."
        >
          {STYLE_LABELS.off}
        </button>
      )}
    </>
  )
}
