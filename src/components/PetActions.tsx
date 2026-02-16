import { useState, useCallback } from 'react'

interface PetActionsProps {
  onFeed: () => boolean
  onPet: () => void
  onPlay: () => boolean
  isSleeping: boolean
  feedCooldown: boolean
  energy: number
}

export default function PetActions({
  onFeed,
  onPet,
  onPlay,
  isSleeping,
  feedCooldown,
  energy,
}: PetActionsProps) {
  const [feedAnim, setFeedAnim] = useState(false)
  const [petAnim, setPetAnim] = useState(false)
  const [playAnim, setPlayAnim] = useState(false)

  const handleFeed = useCallback(() => {
    if (isSleeping || feedCooldown) return
    const ok = onFeed()
    if (ok) {
      setFeedAnim(true)
      setTimeout(() => setFeedAnim(false), 600)
    }
  }, [onFeed, isSleeping, feedCooldown])

  const handlePet = useCallback(() => {
    if (isSleeping) return
    onPet()
    setPetAnim(true)
    setTimeout(() => setPetAnim(false), 600)
  }, [onPet, isSleeping])

  const handlePlay = useCallback(() => {
    if (isSleeping || energy < 20) return
    const ok = onPlay()
    if (ok) {
      setPlayAnim(true)
      setTimeout(() => setPlayAnim(false), 800)
    }
  }, [onPlay, isSleeping, energy])

  const tooTired = energy < 20

  return (
    <div className="pet-actions">
      <button
        className={`pet-action-btn pet-action-feed ${feedAnim ? 'pet-action--active' : ''}`}
        onClick={handleFeed}
        disabled={isSleeping || feedCooldown}
        aria-label="Feed the lamb a lollipop"
        title={isSleeping ? 'shhh...' : feedCooldown ? 'Cooldown...' : 'Feed'}
      >
        🍭 Feed
      </button>
      <button
        className={`pet-action-btn pet-action-pet ${petAnim ? 'pet-action--active' : ''}`}
        onClick={handlePet}
        disabled={isSleeping}
        aria-label="Pet the lamb"
        title={isSleeping ? 'shhh...' : 'Pet'}
      >
        🖐️ Pet
      </button>
      <button
        className={`pet-action-btn pet-action-play ${playAnim ? 'pet-action--active' : ''}`}
        onClick={handlePlay}
        disabled={isSleeping || tooTired}
        aria-label="Play with the lamb"
        title={isSleeping ? 'shhh...' : tooTired ? 'Too tired...' : 'Play'}
      >
        ⚽ Play
      </button>
    </div>
  )
}
