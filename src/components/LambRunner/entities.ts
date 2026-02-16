import type {
  Lamb,
  Obstacle,
  Collectible,
  ObstacleType,
  GameConfig,
  Star,
  Mountain,
} from './types'

export function createLamb(config: GameConfig): Lamb {
  return {
    x: 60,
    y: config.groundY,
    vy: 0,
    width: 24,
    height: 28,
    airborne: false,
    jumpHeld: false,
    jumpHeldStart: 0,
  }
}

const OBSTACLE_TYPES: ObstacleType[] = ['lollipop', 'candy-cane', 'gumball']

export function createObstacle(config: GameConfig): Obstacle {
  const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
  return {
    x: config.canvasWidth + 20,
    y: config.groundY,
    width: 20,
    height: 24,
    type,
    rotation: 0,
  }
}

export function createCollectible(config: GameConfig): Collectible {
  const minY = config.groundY - 80
  const maxY = config.groundY - 30
  return {
    x: config.canvasWidth + 20,
    y: minY + Math.random() * (maxY - minY),
    width: 16,
    height: 16,
    frame: 0,
    collected: false,
  }
}

export function createStars(config: GameConfig, count: number): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * config.canvasWidth * 2,
      y: Math.random() * (config.groundY - 30),
      alpha: 0.3 + Math.random() * 0.7,
    })
  }
  return stars
}

export function createMountains(config: GameConfig): Mountain[] {
  const peaks: Mountain[] = []
  let x = 0
  while (x < config.canvasWidth * 2) {
    const width = 80 + Math.random() * 120
    const height = 30 + Math.random() * 50
    peaks.push({ x, width, height })
    x += width * 0.6 + Math.random() * 40
  }
  return peaks
}

export function updateLamb(lamb: Lamb, config: GameConfig): void {
  if (lamb.airborne) {
    lamb.vy += config.gravity
    lamb.y += lamb.vy

    // Landed
    if (lamb.y >= config.groundY) {
      lamb.y = config.groundY
      lamb.vy = 0
      lamb.airborne = false
    }
  }
}

export function jumpLamb(lamb: Lamb, config: GameConfig, held: boolean): void {
  if (lamb.airborne) return
  lamb.airborne = true
  lamb.vy = held ? config.highJumpVelocity : config.jumpVelocity
}

export function checkCollision(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  // AABB centered on position
  const aLeft = ax - aw / 2
  const aRight = ax + aw / 2
  const aTop = ay - ah
  const aBottom = ay

  const bLeft = bx - bw / 2
  const bRight = bx + bw / 2
  const bTop = by - bh
  const bBottom = by

  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop
}
