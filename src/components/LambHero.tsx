import { useState } from 'react'

export default function LambHero() {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newSparkle = { id: Date.now(), x, y }
    setSparkles(prev => [...prev.slice(-20), newSparkle])

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 1000)
  }

  return (
    <section className="section-box lamb-hero-section" onClick={handleClick}>
      <h2 className="section-title">~ The Lamb ~</h2>
      <div className="lamb-container">
        <div className="sparkle-ring sparkle-ring-1">✦</div>
        <div className="sparkle-ring sparkle-ring-2">✧</div>
        <div className="sparkle-ring sparkle-ring-3">★</div>
        <div className="sparkle-ring sparkle-ring-4">☆</div>
        <div className="lamb-image-wrapper">
          <div className="lamb-emoji">🐑</div>
        </div>
        <div className="sparkle-ring sparkle-ring-5">✦</div>
        <div className="sparkle-ring sparkle-ring-6">✧</div>
        {sparkles.map(sparkle => (
          <span
            key={sparkle.id}
            className="click-sparkle"
            style={{ left: sparkle.x, top: sparkle.y }}
          >
            ✨
          </span>
        ))}
      </div>
      <p className="lamb-caption glow-text">
        ★ Click the lamb for sparkles! ★
      </p>
      <div className="lamb-facts">
        <p className="retro-text">
          🍭 Did you know? Lambs are born with the innate knowledge of how to
          make the perfect lollipop. This is a well-documented scientific fact
          that I just made up.
        </p>
        <p className="retro-text">
          🍭 The ancient Sumerians believed that lambs held the secret to
          eternal sweetness. They were probably right.
        </p>
      </div>
    </section>
  )
}
