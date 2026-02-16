import { useState, useCallback, useEffect, useRef } from 'react'

export type PetMood = 'happy' | 'hungry' | 'sad' | 'tired' | 'ecstatic'

export interface PetState {
  name: string | null
  hunger: number    // 0-100 (100 = full)
  happiness: number // 0-100
  energy: number    // 0-100
  lastVisit: number // timestamp ms
  lastFed: number   // timestamp ms
  lastPlayed: number // timestamp ms
}

interface PetActions {
  setName: (name: string) => void
  feed: () => boolean   // returns false if on cooldown
  pet: () => void
  play: () => boolean   // returns false if too tired
}

interface UsePetStateReturn {
  state: PetState
  mood: PetMood
  actions: PetActions
  feedCooldown: boolean
}

const STORAGE_KEY = 'lambPetState'
const FEED_COOLDOWN_MS = 3000
const HUNGER_DECAY_PER_HOUR = 5
const HAPPINESS_DECAY_PER_HOUR = 3
const HAPPINESS_DECAY_THRESHOLD_HOURS = 6
const LONELINESS_THRESHOLD_DAYS = 7
const ENERGY_RECHARGE_PER_HOUR = 10
const LIVE_DECAY_INTERVAL_MS = 60_000 // 1 minute
const LIVE_HUNGER_DECAY = 0.08

const DEFAULT_STATE: PetState = {
  name: null,
  hunger: 80,
  happiness: 80,
  energy: 80,
  lastVisit: Date.now(),
  lastFed: Date.now(),
  lastPlayed: Date.now(),
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function loadState(): PetState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE, lastVisit: Date.now() }
    const stored = JSON.parse(raw) as PetState
    return applyTimeDecay(stored)
  } catch {
    return { ...DEFAULT_STATE, lastVisit: Date.now() }
  }
}

function saveState(state: PetState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage full or unavailable
  }
}

function applyTimeDecay(stored: PetState): PetState {
  const now = Date.now()
  const hoursAway = (now - stored.lastVisit) / (1000 * 60 * 60)

  if (hoursAway < 0.01) return { ...stored, lastVisit: now }

  // Hunger decays over time
  let hunger = stored.hunger - (hoursAway * HUNGER_DECAY_PER_HOUR)

  // Happiness decays if away for 6+ hours
  let happiness = stored.happiness
  if (hoursAway > HAPPINESS_DECAY_THRESHOLD_HOURS) {
    const decayHours = hoursAway - HAPPINESS_DECAY_THRESHOLD_HOURS
    happiness -= decayHours * HAPPINESS_DECAY_PER_HOUR
  }
  // Extra penalty if away 24+ hours
  if (hoursAway > 24) {
    happiness -= 10
  }

  // Loneliness: 7+ days away tanks happiness
  const daysAway = hoursAway / 24
  if (daysAway >= LONELINESS_THRESHOLD_DAYS) {
    happiness = Math.min(happiness, 15)
  }

  // Energy recharges while away
  let energy = stored.energy + (hoursAway * ENERGY_RECHARGE_PER_HOUR)

  return {
    ...stored,
    hunger: clamp(hunger, 0, 100),
    happiness: clamp(happiness, 0, 100),
    energy: clamp(energy, 0, 100),
    lastVisit: now,
  }
}

function computeMood(state: PetState): PetMood {
  if (state.hunger > 80 && state.happiness > 80 && state.energy > 80) return 'ecstatic'
  if (state.hunger < 30) return 'hungry'
  if (state.happiness < 20) return 'sad'
  if (state.energy < 20) return 'tired'
  return 'happy'
}

export function usePetState(): UsePetStateReturn {
  const [state, setState] = useState<PetState>(loadState)
  const [feedCooldown, setFeedCooldown] = useState(false)
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Save to localStorage on every state change
  useEffect(() => {
    saveState(state)
  }, [state])

  // Live decay: hunger ticks down slowly while page is open
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        hunger: clamp(prev.hunger - LIVE_HUNGER_DECAY, 0, 100),
      }))
    }, LIVE_DECAY_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  // Cleanup cooldown timer
  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current)
    }
  }, [])

  const setName = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      name: name.trim(),
      hunger: 80,
      happiness: 80,
      energy: 80,
      lastVisit: Date.now(),
      lastFed: Date.now(),
      lastPlayed: Date.now(),
    }))
  }, [])

  const feed = useCallback((): boolean => {
    if (feedCooldown) return false
    setState(prev => ({
      ...prev,
      hunger: clamp(prev.hunger + 25, 0, 100),
      happiness: clamp(prev.happiness + 5, 0, 100),
      lastFed: Date.now(),
    }))
    setFeedCooldown(true)
    cooldownRef.current = setTimeout(() => {
      setFeedCooldown(false)
      cooldownRef.current = null
    }, FEED_COOLDOWN_MS)
    return true
  }, [feedCooldown])

  const pet = useCallback(() => {
    setState(prev => ({
      ...prev,
      happiness: clamp(prev.happiness + 10, 0, 100),
    }))
  }, [])

  const play = useCallback((): boolean => {
    if (state.energy < 20) return false
    setState(prev => ({
      ...prev,
      happiness: clamp(prev.happiness + 15, 0, 100),
      energy: clamp(prev.energy - 20, 0, 100),
      lastPlayed: Date.now(),
    }))
    return true
  }, [state.energy])

  return {
    state,
    mood: computeMood(state),
    actions: { setName, feed, pet, play },
    feedCooldown,
  }
}
