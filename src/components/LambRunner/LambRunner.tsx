import { useEffect, useRef, useState, useCallback } from 'react'
import { DEFAULT_CONFIG } from './types'
import { createGameEngine } from './engine'
import type { GameEngine } from './engine'

const isTouchDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export default function LambRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const [highScore, setHighScore] = useState(() => {
    try {
      return Number(localStorage.getItem('lambRunnerHighScore')) || 0
    } catch {
      return 0
    }
  })

  // Sync high score display periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (engineRef.current) {
        setHighScore(engineRef.current.getHighScore())
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Init engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = createGameEngine(canvas, DEFAULT_CONFIG)
    engineRef.current = engine
    engine.start()

    const onKeyDown = (e: KeyboardEvent) => engine.handleKeyDown(e)
    const onKeyUp = (e: KeyboardEvent) => engine.handleKeyUp(e)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      engine.destroy()
      engineRef.current = null
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const handlePointerDown = useCallback(() => {
    engineRef.current?.handlePointerDown()
  }, [])

  const handlePointerUp = useCallback(() => {
    engineRef.current?.handlePointerUp()
  }, [])

  const touch = isTouchDevice()

  return (
    <section className="section-box lamb-runner-section">
      <h2 className="section-title">~ Lamb Runner ~</h2>
      <div className="lamb-runner-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={DEFAULT_CONFIG.canvasWidth}
          height={DEFAULT_CONFIG.canvasHeight}
          className="lamb-runner-canvas"
          role="img"
          aria-label="Lamb Runner game - press Space to start"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        />
      </div>
      <p className="lamb-runner-instructions">
        {touch ? 'TAP to jump · HOLD for higher' : 'SPACE to jump · HOLD for higher'}
      </p>
      <p className="lamb-runner-highscore">
        HIGH SCORE: {String(highScore).padStart(5, '0')}
      </p>
    </section>
  )
}
