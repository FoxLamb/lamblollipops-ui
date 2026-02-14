import { useState, useCallback, useRef, useEffect } from 'react'
import type { LambMood } from '../hooks/useSeasonalTheme'

interface LambHeroProps {
  mood?: LambMood
  costume?: string | null
}

// Caption text by mood
function getCaptionText(mood: LambMood): string {
  switch (mood) {
    case 'sleeping': return '🌙 shhh... the lamb is sleeping... 🌙'
    case 'golden': return '✨ THE GOLDEN LAMB ✨ You are truly blessed! ✨'
    case 'santa': return '🎅 Ho ho ho! Merry Christmas! 🎄'
    case 'pumpkin': return '🎃 Spooky lamb says BOO! 👻'
    case 'hearts': return '💕 The lamb loves you! Happy Valentine\'s! 💕'
    case 'shamrock': return '☘️ Feeling lucky? The lamb found a four-leaf clover! ☘️'
    case 'bunny': return '🐣 Hoppy Easter! The lamb found all the eggs! 🥚'
    case 'fiesta': return '🎊 Feliz Cinco de Mayo! Fiesta lamb! 🌮'
    case 'sunglasses': return '😎 Weekend vibes! The lamb is chilling! 😎'
    default: return '★ Click the lamb for sparkles! ★'
  }
}

export default function LambHero({ mood = 'default', costume = null }: LambHeroProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const [isAwake, setIsAwake] = useState(false)
  const wakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up wake timeout
  useEffect(() => {
    return () => {
      if (wakeTimeoutRef.current) clearTimeout(wakeTimeoutRef.current)
    }
  }, [])

  // Reset awake state when mood changes away from sleeping
  useEffect(() => {
    if (mood !== 'sleeping') {
      setIsAwake(false)
      if (wakeTimeoutRef.current) {
        clearTimeout(wakeTimeoutRef.current)
        wakeTimeoutRef.current = null
      }
    }
  }, [mood])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newSparkle = { id: Date.now(), x, y }
    setSparkles(prev => [...prev.slice(-20), newSparkle])

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 1000)

    // Wake the sleeping lamb briefly
    if (mood === 'sleeping' && !isAwake) {
      setIsAwake(true)
      if (wakeTimeoutRef.current) clearTimeout(wakeTimeoutRef.current)
      wakeTimeoutRef.current = setTimeout(() => {
        setIsAwake(false)
        wakeTimeoutRef.current = null
      }, 2500)
    }
  }, [mood, isAwake])

  const isSleeping = mood === 'sleeping' && !isAwake
  const isYawning = mood === 'sleeping' && isAwake

  // Build CSS classes for the lamb section
  const sectionClasses = [
    'section-box',
    'lamb-hero-section',
  ].filter(Boolean).join(' ')

  // Build CSS classes for the lamb emoji
  const emojiClasses = [
    'lamb-emoji',
    isSleeping ? 'lamb-sleeping' : '',
    isYawning ? 'lamb-yawning' : '',
    mood === 'golden' ? 'lamb-golden' : '',
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClasses} onClick={handleClick}>
      <h2 className="section-title">~ The Lamb ~</h2>
      <div className="lamb-container">
        <div className="sparkle-ring sparkle-ring-1">✦</div>
        <div className="sparkle-ring sparkle-ring-2">✧</div>
        <div className="sparkle-ring sparkle-ring-3">★</div>
        <div className="sparkle-ring sparkle-ring-4">☆</div>
        <div className="lamb-image-wrapper">
          <div className={emojiClasses}>🐑</div>

          {/* Costume overlay */}
          {costume && (
            <span className="lamb-costume" aria-hidden="true">{costume}</span>
          )}

          {/* Sleeping Zzz particles */}
          {isSleeping && (
            <div className="zzz-container" aria-hidden="true">
              <span className="zzz-particle zzz-1">Z</span>
              <span className="zzz-particle zzz-2">z</span>
              <span className="zzz-particle zzz-3">Z</span>
            </div>
          )}

          {/* Yawning indicator */}
          {isYawning && (
            <span className="lamb-yawn-text" aria-hidden="true">*yaaawn*</span>
          )}
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
        {getCaptionText(mood)}
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
        <p className="retro-text">
          🍭 A lamb's wool can absorb up to 30% of its weight in moisture
          without feeling wet. This is why they never drop their lollipops
          in the rain.
        </p>
        <p className="retro-text">
          🍭 Lambs can recognize up to 50 other sheep faces and remember them
          for years. They never forget who shared a lollipop with them.
        </p>
        <p className="retro-text">
          🍭 Baby lambs can walk within minutes of being born. Scientists
          believe this is so they can get to the candy store faster.
        </p>
        <p className="retro-text">
          🍭 Sheep have rectangular pupils, giving them a 340-degree field
          of vision. They can spot a lollipop from nearly any angle.
        </p>
        <p className="retro-text">
          🍭 A group of lambs is called a "flock." A group of lambs with
          lollipops is called "a really good time."
        </p>
        <p className="retro-text">
          🍭 Lambs have excellent memories and can remember how to navigate
          a maze for up to 6 weeks. Especially if there's candy at the end.
        </p>
      </div>
    </section>
  )
}
