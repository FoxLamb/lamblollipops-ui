import { useState, useCallback, useRef, useEffect } from 'react'
import type { LambMood } from '../hooks/useSeasonalTheme'
import type { PetMood } from '../hooks/usePetState'
import PetNamePrompt from './PetNamePrompt'
import PetActions from './PetActions'
import PetStats from './PetStats'

interface PetState {
  name: string | null
  hunger: number
  happiness: number
  energy: number
}

interface PetActionsHandlers {
  setName: (name: string) => void
  feed: () => boolean
  pet: () => void
  play: () => boolean
}

interface LambHeroProps {
  mood?: LambMood
  costume?: string | null
  petState: PetState
  petMood: PetMood
  petActions: PetActionsHandlers
  feedCooldown: boolean
}

// Caption text — pet mood overlays when no seasonal override
function getCaptionText(mood: LambMood, petMood: PetMood, petName: string | null): string {
  // Seasonal/special moods take priority
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
  }

  if (!petName) return '★ Click the lamb for sparkles! ★'

  // Pet mood captions
  switch (petMood) {
    case 'ecstatic': return `★ ${petName} is absolutely thriving! ★`
    case 'hungry': return `🍭 ${petName} looks hungry... feed me! 🍭`
    case 'sad': return `💔 ${petName} missed you... 💔`
    case 'tired': return `😴 ${petName} is getting sleepy... 😴`
    default: return `★ ${petName} loves the sparkles! ★`
  }
}

type ActionReaction = { id: number; type: 'feed' | 'pet' | 'play' }

export default function LambHero({
  mood = 'default',
  costume = null,
  petState,
  petMood,
  petActions,
  feedCooldown,
}: LambHeroProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const [isAwake, setIsAwake] = useState(false)
  const [reactions, setReactions] = useState<ActionReaction[]>([])
  const [lambReaction, setLambReaction] = useState<'feed' | 'play' | null>(null)
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
    // Don't trigger sparkles/pet when clicking buttons inside
    if ((e.target as HTMLElement).closest('.pet-actions, .pet-name-prompt')) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newSparkle = { id: Date.now(), x, y }
    setSparkles(prev => [...prev.slice(-20), newSparkle])

    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 1000)

    // Clicking the lamb also counts as petting (when not sleeping)
    if (mood !== 'sleeping' && petState.name) {
      petActions.pet()
    }

    // Wake the sleeping lamb briefly
    if (mood === 'sleeping' && !isAwake) {
      setIsAwake(true)
      if (wakeTimeoutRef.current) clearTimeout(wakeTimeoutRef.current)
      wakeTimeoutRef.current = setTimeout(() => {
        setIsAwake(false)
        wakeTimeoutRef.current = null
      }, 2500)
    }
  }, [mood, isAwake, petState.name, petActions])

  // Spawn floating reaction particles
  const spawnReaction = useCallback((type: 'feed' | 'pet' | 'play') => {
    const count = type === 'pet' ? 4 : 1
    const newReactions: ActionReaction[] = []
    for (let i = 0; i < count; i++) {
      newReactions.push({ id: Date.now() + i, type })
    }
    setReactions(prev => [...prev, ...newReactions])
    setTimeout(() => {
      setReactions(prev => prev.filter(r => !newReactions.some(nr => nr.id === r.id)))
    }, 1200)

    // Lamb body reaction (chomp for feed, bounce for play)
    if (type === 'feed' || type === 'play') {
      setLambReaction(type)
      setTimeout(() => setLambReaction(null), 600)
    }
  }, [])

  // Wrapped action handlers that trigger visuals
  const handleFeed = useCallback(() => {
    const ok = petActions.feed()
    if (ok) spawnReaction('feed')
    return ok
  }, [petActions, spawnReaction])

  const handlePet = useCallback(() => {
    petActions.pet()
    spawnReaction('pet')
  }, [petActions, spawnReaction])

  const handlePlay = useCallback(() => {
    const ok = petActions.play()
    if (ok) spawnReaction('play')
    return ok
  }, [petActions, spawnReaction])

  const isSleeping = mood === 'sleeping' && !isAwake
  const isYawning = mood === 'sleeping' && isAwake
  const hasName = petState.name !== null

  // Build CSS classes for the lamb emoji
  const emojiClasses = [
    'lamb-emoji',
    isSleeping ? 'lamb-sleeping' : '',
    isYawning ? 'lamb-yawning' : '',
    mood === 'golden' ? 'lamb-golden' : '',
    hasName && petMood === 'hungry' ? 'lamb-pet-hungry' : '',
    hasName && petMood === 'sad' ? 'lamb-pet-sad' : '',
    hasName && petMood === 'tired' ? 'lamb-pet-tired' : '',
    hasName && petMood === 'ecstatic' ? 'lamb-pet-ecstatic' : '',
    lambReaction === 'feed' ? 'lamb-chomp' : '',
    lambReaction === 'play' ? 'lamb-bounce' : '',
  ].filter(Boolean).join(' ')

  return (
    <section className="section-box lamb-hero-section" onClick={handleClick}>
      <h2 className="section-title">~ The Lamb ~</h2>

      {/* Name prompt or name banner */}
      {!hasName ? (
        <PetNamePrompt onSubmit={petActions.setName} />
      ) : (
        <div className="lamb-name-banner glow-text">
          「 {petState.name} 」
        </div>
      )}

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
        {/* Action reaction particles */}
        {reactions.map((r) => {
          const emoji = r.type === 'feed' ? '🍭' : r.type === 'pet' ? '💖' : '⚽'
          const cls = `action-reaction action-reaction--${r.type}`
          return (
            <span key={r.id} className={cls} aria-hidden="true">
              {emoji}
            </span>
          )
        })}
      </div>

      {/* Pet action buttons — only show when named */}
      {hasName && (
        <PetActions
          onFeed={handleFeed}
          onPet={handlePet}
          onPlay={handlePlay}
          isSleeping={mood === 'sleeping'}
          feedCooldown={feedCooldown}
          energy={petState.energy}
        />
      )}

      <p className="lamb-caption glow-text" aria-live="polite">
        {getCaptionText(mood, petMood, petState.name)}
      </p>

      {/* Pet stats — only show when named */}
      {hasName && (
        <PetStats
          hunger={petState.hunger}
          happiness={petState.happiness}
          energy={petState.energy}
        />
      )}

      <div className="lamb-facts">
        <p className="retro-text">
          🐑 Lambs can recognize up to 50 individual faces — both sheep and
          human — and remember them for years.
        </p>
        <p className="retro-text">
          🐑 Sheep have rectangular pupils that give them nearly 340-degree
          panoramic vision. They can see behind themselves without turning
          their heads.
        </p>
        <p className="retro-text">
          🐑 Baby lambs can stand and walk within minutes of being born.
          Within a day they can keep up with the flock.
        </p>
        <p className="retro-text">
          🐑 Sheep are one of the first animals ever domesticated by humans,
          going back roughly 10,000 years to ancient Mesopotamia.
        </p>
        <p className="retro-text">
          🐑 A lamb's wool can absorb up to 30% of its own weight in moisture
          before it even feels damp to the touch.
        </p>
        <p className="retro-text">
          🐑 Sheep have been shown to experience emotions like fear, anger,
          boredom, and happiness. They can even be optimistic or pessimistic
          depending on their experiences.
        </p>
        <p className="retro-text">
          🐑 Lambs form strong bonds with their mothers and can identify her
          by her unique bleat within hours of being born.
        </p>
        <p className="retro-text">
          🐑 Sheep have excellent spatial memory and can navigate complex
          mazes. They remember the solution for over six weeks.
        </p>
      </div>
    </section>
  )
}
