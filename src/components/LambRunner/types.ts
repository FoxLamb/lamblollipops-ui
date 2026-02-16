export type GamePhase = 'menu' | 'playing' | 'gameover'

export interface Position {
  x: number
  y: number
}

export interface Lamb {
  x: number
  y: number
  vy: number
  width: number
  height: number
  airborne: boolean
  jumpHeld: boolean
  jumpHeldStart: number
}

export type ObstacleType = 'lollipop' | 'candy-cane' | 'gumball'

export interface Obstacle {
  x: number
  y: number
  width: number
  height: number
  type: ObstacleType
  rotation: number // for gumball spin
}

export interface Collectible {
  x: number
  y: number
  width: number
  height: number
  frame: number // for bob animation
  collected: boolean
}

export interface ParallaxLayer {
  offset: number
  speed: number // multiplier of game speed
}

export interface Star {
  x: number
  y: number
  alpha: number
}

export interface Mountain {
  x: number
  width: number
  height: number
}

export interface GameState {
  phase: GamePhase
  lamb: Lamb
  obstacles: Obstacle[]
  collectibles: Collectible[]
  score: number
  highScore: number
  gameSpeed: number
  frameCount: number
  spawnCooldown: number
  bgLayers: {
    stars: { layer: ParallaxLayer; points: Star[] }
    mountains: { layer: ParallaxLayer; peaks: Mountain[] }
    ground: { layer: ParallaxLayer }
  }
}

export interface GameConfig {
  canvasWidth: number
  canvasHeight: number
  groundY: number
  gravity: number
  jumpVelocity: number
  highJumpVelocity: number
  initialSpeed: number
  speedIncrement: number
  maxSpeed: number
  minSpawnGap: number
  collectibleChance: number
  collectibleScore: number
}

export const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 600,
  canvasHeight: 200,
  groundY: 170,
  gravity: 0.6,
  jumpVelocity: -12,
  highJumpVelocity: -15,
  initialSpeed: 3,
  speedIncrement: 0.001,
  maxSpeed: 8,
  minSpawnGap: 80,
  collectibleChance: 0.3,
  collectibleScore: 50,
}
