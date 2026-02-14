import { useEffect, useRef } from 'react'

interface StarFieldProps {
  density?: number
  brightness?: number
  showMoon?: boolean
  showFireflies?: boolean
}

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  twinkleSpeed: number
}

interface Firefly {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  glowPhase: number
  glowSpeed: number
}

export default function StarField({
  density = 1,
  brightness = 1,
  showMoon = false,
  showFireflies = false,
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Store props in refs so the animation loop can read current values
  const propsRef = useRef({ density, brightness, showMoon, showFireflies })
  propsRef.current = { density, brightness, showMoon, showFireflies }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const stars: Star[] = []
    const fireflies: Firefly[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initStars = () => {
      stars.length = 0
      const d = propsRef.current.density
      const count = Math.floor((canvas.width * canvas.height) / 3000 * d)
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        })
      }
    }

    const initFireflies = () => {
      fireflies.length = 0
      if (!propsRef.current.showFireflies) return
      const count = 8 + Math.floor(Math.random() * 5)
      for (let i = 0; i < count; i++) {
        fireflies.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.3,
          glowPhase: Math.random() * Math.PI * 2,
          glowSpeed: 0.01 + Math.random() * 0.02,
        })
      }
    }

    const drawMoon = () => {
      if (!propsRef.current.showMoon) return

      const moonX = canvas.width - 100
      const moonY = 80
      const moonR = 30

      // Outer glow
      const glow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 3)
      glow.addColorStop(0, 'rgba(255, 255, 200, 0.08)')
      glow.addColorStop(1, 'rgba(255, 255, 200, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2)
      ctx.fill()

      // Moon body
      ctx.fillStyle = 'rgba(255, 255, 220, 0.9)'
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
      ctx.fill()

      // Crescent shadow (offset circle to create crescent)
      ctx.fillStyle = 'rgba(10, 0, 30, 0.95)'
      ctx.beginPath()
      ctx.arc(moonX + 12, moonY - 4, moonR * 0.85, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawFireflies = () => {
      if (!propsRef.current.showFireflies) return

      for (const fly of fireflies) {
        fly.x += fly.vx
        fly.y += fly.vy
        fly.glowPhase += fly.glowSpeed

        // Gentle random drift
        fly.vx += (Math.random() - 0.5) * 0.02
        fly.vy += (Math.random() - 0.5) * 0.02
        fly.vx *= 0.99
        fly.vy *= 0.99

        // Wrap around edges
        if (fly.x < -20) fly.x = canvas.width + 20
        if (fly.x > canvas.width + 20) fly.x = -20
        if (fly.y < -20) fly.y = canvas.height + 20
        if (fly.y > canvas.height + 20) fly.y = -20

        const glow = (Math.sin(fly.glowPhase) + 1) * 0.5
        const alpha = fly.opacity * glow

        // Outer glow
        const gradient = ctx.createRadialGradient(fly.x, fly.y, 0, fly.x, fly.y, 12)
        gradient.addColorStop(0, `rgba(255, 255, 150, ${alpha * 0.6})`)
        gradient.addColorStop(0.5, `rgba(255, 255, 100, ${alpha * 0.2})`)
        gradient.addColorStop(1, 'rgba(255, 255, 100, 0)')
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(fly.x, fly.y, 12, 0, Math.PI * 2)
        ctx.fill()

        // Core dot
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`
        ctx.beginPath()
        ctx.arc(fly.x, fly.y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const animate = () => {
      const b = propsRef.current.brightness

      ctx.fillStyle = 'rgba(10, 0, 30, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (const star of stars) {
        star.opacity += star.twinkleSpeed
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkleSpeed *= -1
        }

        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }

        const adjustedOpacity = Math.min(1, star.opacity * b)

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${adjustedOpacity})`
        ctx.fill()

        // Add color to some stars
        if (star.size > 1.5) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
          const colors = ['rgba(255, 113, 206, 0.15)', 'rgba(1, 205, 254, 0.15)', 'rgba(185, 103, 255, 0.15)']
          ctx.fillStyle = colors[Math.floor(star.x) % 3]
          ctx.fill()
        }
      }

      drawMoon()
      drawFireflies()

      animationId = requestAnimationFrame(animate)
    }

    resize()
    initStars()
    initFireflies()
    // Clear canvas fully once before starting animation
    ctx.fillStyle = 'rgb(10, 0, 30)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    animate()

    const handleResize = () => {
      resize()
      initStars()
      initFireflies()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [density, brightness, showMoon, showFireflies])

  return <canvas ref={canvasRef} className="starfield-canvas" />
}
