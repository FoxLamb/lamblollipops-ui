import type { GameState, GameConfig } from './types'
import { DEFAULT_CONFIG } from './types'
import {
  createLamb,
  createObstacle,
  createCollectible,
  createStars,
  createMountains,
  updateLamb,
  jumpLamb,
  checkCollision,
} from './entities'
import { render, readThemeColors } from './renderer'
import type { ThemeColors } from './renderer'

const HIGHSCORE_KEY = 'lambRunnerHighScore'
const HOLD_THRESHOLD_MS = 150
const SPAWN_DELAY_FRAMES = 60
const BLINK_INTERVAL_MS = 500

function loadHighScore(): number {
  try {
    return Number(localStorage.getItem(HIGHSCORE_KEY)) || 0
  } catch {
    return 0
  }
}

function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGHSCORE_KEY, String(score))
  } catch {
    // noop
  }
}

export interface GameEngine {
  start: () => void
  destroy: () => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleKeyUp: (e: KeyboardEvent) => void
  handlePointerDown: () => void
  handlePointerUp: () => void
  getPhase: () => string
  getScore: () => number
  getHighScore: () => number
}

export function createGameEngine(
  canvas: HTMLCanvasElement,
  config: GameConfig = DEFAULT_CONFIG
): GameEngine {
  const ctx = canvas.getContext('2d')!
  let animId: number | null = null
  let paused = false
  let blinkOn = true
  let blinkTimer: ReturnType<typeof setInterval> | null = null
  let colors: ThemeColors = readThemeColors()
  let pointerDownTime = 0

  const state: GameState = {
    phase: 'menu',
    lamb: createLamb(config),
    obstacles: [],
    collectibles: [],
    score: 0,
    highScore: loadHighScore(),
    gameSpeed: config.initialSpeed,
    frameCount: 0,
    spawnCooldown: SPAWN_DELAY_FRAMES,
    bgLayers: {
      stars: {
        layer: { offset: 0, speed: 0.2 },
        points: createStars(config, 40),
      },
      mountains: {
        layer: { offset: 0, speed: 0.5 },
        peaks: createMountains(config),
      },
      ground: {
        layer: { offset: 0, speed: 1 },
      },
    },
  }

  function resetGame(): void {
    state.lamb = createLamb(config)
    state.obstacles = []
    state.collectibles = []
    state.score = 0
    state.gameSpeed = config.initialSpeed
    state.frameCount = 0
    state.spawnCooldown = SPAWN_DELAY_FRAMES
    state.bgLayers.stars.layer.offset = 0
    state.bgLayers.mountains.layer.offset = 0
    state.bgLayers.ground.layer.offset = 0
  }

  function update(): void {
    if (state.phase !== 'playing') return

    state.frameCount++

    // Update lamb physics
    updateLamb(state.lamb, config)

    // Scroll parallax
    state.bgLayers.stars.layer.offset += state.gameSpeed * state.bgLayers.stars.layer.speed
    state.bgLayers.mountains.layer.offset += state.gameSpeed * state.bgLayers.mountains.layer.speed
    state.bgLayers.ground.layer.offset += state.gameSpeed * state.bgLayers.ground.layer.speed

    // Move obstacles
    for (const obs of state.obstacles) {
      obs.x -= state.gameSpeed
      if (obs.type === 'gumball') {
        obs.rotation += 0.1
      }
    }

    // Move collectibles
    for (const c of state.collectibles) {
      c.x -= state.gameSpeed
      c.frame++
    }

    // Remove off-screen
    state.obstacles = state.obstacles.filter(o => o.x > -50)
    state.collectibles = state.collectibles.filter(c => c.x > -50 && !c.collected)

    // Spawn obstacles
    state.spawnCooldown--
    if (state.spawnCooldown <= 0 && state.frameCount > SPAWN_DELAY_FRAMES) {
      state.obstacles.push(createObstacle(config))

      // Maybe spawn a collectible too
      if (Math.random() < config.collectibleChance) {
        state.collectibles.push(createCollectible(config))
      }

      // Next spawn gap scales inversely with speed
      const minGap = config.minSpawnGap
      const maxGap = minGap + 60
      state.spawnCooldown = minGap + Math.floor(Math.random() * (maxGap - minGap))
    }

    // Collision: obstacles
    for (const obs of state.obstacles) {
      if (
        checkCollision(
          state.lamb.x, state.lamb.y, state.lamb.width, state.lamb.height,
          obs.x, obs.y, obs.width, obs.height
        )
      ) {
        gameOver()
        return
      }
    }

    // Collision: collectibles
    for (const c of state.collectibles) {
      if (c.collected) continue
      const bobY = c.y + Math.sin(c.frame * 0.08) * 4
      if (
        checkCollision(
          state.lamb.x, state.lamb.y, state.lamb.width, state.lamb.height,
          c.x, bobY, c.width, c.height
        )
      ) {
        c.collected = true
        state.score += config.collectibleScore
      }
    }

    // Score & speed
    state.score += 0.1
    state.gameSpeed = Math.min(
      config.maxSpeed,
      state.gameSpeed + config.speedIncrement
    )
  }

  function gameOver(): void {
    state.phase = 'gameover'
    state.frameCount = 0
    if (Math.floor(state.score) > state.highScore) {
      state.highScore = Math.floor(state.score)
      saveHighScore(state.highScore)
    }
  }

  function loop(): void {
    if (paused) {
      animId = requestAnimationFrame(loop)
      return
    }

    update()
    render(ctx, state, config, colors, blinkOn)
    animId = requestAnimationFrame(loop)
  }

  function startPlaying(): void {
    if (state.phase === 'playing') return
    resetGame()
    state.phase = 'playing'
  }

  // --- Public API ---

  function start(): void {
    colors = readThemeColors()
    blinkTimer = setInterval(() => { blinkOn = !blinkOn }, BLINK_INTERVAL_MS)

    // Pause on blur
    const onBlur = () => { paused = true }
    const onFocus = () => {
      paused = false
      colors = readThemeColors()
    }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    // Initial render
    render(ctx, state, config, colors, blinkOn)
    animId = requestAnimationFrame(loop)

    // Store cleanup refs
    ;(canvas as unknown as Record<string, unknown>).__engineCleanup = () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }

  function destroy(): void {
    if (animId !== null) cancelAnimationFrame(animId)
    if (blinkTimer !== null) clearInterval(blinkTimer)
    const cleanup = (canvas as unknown as Record<string, unknown>).__engineCleanup as (() => void) | undefined
    if (cleanup) cleanup()
  }

  function handleAction(): void {
    if (state.phase === 'menu') {
      startPlaying()
    } else if (state.phase === 'gameover') {
      startPlaying()
    } else if (state.phase === 'playing') {
      const held = pointerDownTime > 0 && (Date.now() - pointerDownTime) > HOLD_THRESHOLD_MS
      jumpLamb(state.lamb, config, held)
    }
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.code !== 'Space' && e.code !== 'Enter') return
    e.preventDefault()

    if (state.phase === 'playing') {
      if (!state.lamb.jumpHeld) {
        state.lamb.jumpHeldStart = Date.now()
        state.lamb.jumpHeld = true
      }
    } else {
      handleAction()
    }
  }

  function handleKeyUp(e: KeyboardEvent): void {
    if (e.code !== 'Space' && e.code !== 'Enter') return
    e.preventDefault()

    if (state.phase === 'playing' && state.lamb.jumpHeld) {
      const held = (Date.now() - state.lamb.jumpHeldStart) > HOLD_THRESHOLD_MS
      jumpLamb(state.lamb, config, held)
      state.lamb.jumpHeld = false
    }
  }

  function handlePointerDown(): void {
    pointerDownTime = Date.now()
    if (state.phase !== 'playing') {
      handleAction()
    }
  }

  function handlePointerUp(): void {
    if (state.phase === 'playing') {
      const held = pointerDownTime > 0 && (Date.now() - pointerDownTime) > HOLD_THRESHOLD_MS
      jumpLamb(state.lamb, config, held)
    }
    pointerDownTime = 0
  }

  return {
    start,
    destroy,
    handleKeyDown,
    handleKeyUp,
    handlePointerDown,
    handlePointerUp,
    getPhase: () => state.phase,
    getScore: () => Math.floor(state.score),
    getHighScore: () => state.highScore,
  }
}
