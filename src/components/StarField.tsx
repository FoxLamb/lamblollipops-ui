import { useEffect, useRef } from 'react'

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const stars: { x: number; y: number; size: number; speed: number; opacity: number; twinkleSpeed: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initStars = () => {
      stars.length = 0
      const count = Math.floor((canvas.width * canvas.height) / 3000)
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

    const animate = () => {
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

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
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

      animationId = requestAnimationFrame(animate)
    }

    resize()
    initStars()
    // Clear canvas fully once before starting animation
    ctx.fillStyle = 'rgb(10, 0, 30)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    animate()

    window.addEventListener('resize', () => {
      resize()
      initStars()
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield-canvas" />
}
