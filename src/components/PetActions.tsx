import { useState, useCallback } from 'react'

interface PetActionsProps {
  onFeed: () => boolean
  onPet: () => void
  onPlay: () => boolean
  feedCooldown: boolean
  energy: number
}

export default function PetActions({
  onFeed,
  onPet,
  onPlay,
  feedCooldown,
  energy,
}: PetActionsProps) {
  const [feedAnim, setFeedAnim] = useState(false)
  const [petAnim, setPetAnim] = useState(false)
  const [playAnim, setPlayAnim] = useState(false)

  const handleFeed = useCallback(() => {
    if (feedCooldown) return
    const ok = onFeed()
    if (ok) {
      setFeedAnim(true)
      setTimeout(() => setFeedAnim(false), 600)
    }
  }, [onFeed, feedCooldown])

  const handlePet = useCallback(() => {
    onPet()
    setPetAnim(true)
    setTimeout(() => setPetAnim(false), 600)
  }, [onPet])

  const handlePlay = useCallback(() => {
    if (energy < 20) return
    const ok = onPlay()
    if (ok) {
      setPlayAnim(true)
      setTimeout(() => setPlayAnim(false), 800)
    }
  }, [onPlay, energy])

  const tooTired = energy < 20

  return (
    <div className="pet-actions">
      <button
        className={`pet-action-btn pet-action-feed ${feedAnim ? 'pet-action--active' : ''}`}
        onClick={handleFeed}
        disabled={feedCooldown}
        aria-label="Feed the lamb a lollipop"
        title={feedCooldown ? 'Cooldown...' : 'Feed'}
      >
        🍭 Feed
      </button>
      <button
        className={`pet-action-btn pet-action-pet ${petAnim ? 'pet-action--active' : ''}`}
        onClick={handlePet}
        aria-label="Pet the lamb"
        title="Pet"
      >
        🖐️ Pet
      </button>
      <button
        className={`pet-action-btn pet-action-play ${playAnim ? 'pet-action--active' : ''}`}
        onClick={handlePlay}
        disabled={tooTired}
        aria-label="Play with the lamb"
        title={tooTired ? 'Too tired...' : 'Play'}
      >
        ⚽ Play
      </button>
    </div>
  )
}
