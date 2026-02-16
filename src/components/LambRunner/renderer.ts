import type { GameState, GameConfig } from './types'

export interface ThemeColors {
  sky: string
  mountainFill: string
  groundLine: string
  groundGrid: string
  scoreText: string
  uiText: string
  uiGlow: string
}

const DEFAULT_COLORS: ThemeColors = {
  sky: '#0a001e',
  mountainFill: '#1a002e',
  groundLine: '#ff71ce',
  groundGrid: 'rgba(255, 113, 206, 0.25)',
  scoreText: '#01cdfe',
  uiText: '#01cdfe',
  uiGlow: 'rgba(1, 205, 254, 0.6)',
}

const OBSTACLE_EMOJI: Record<string, string> = {
  'lollipop': '🍭',
  'candy-cane': '🍬',
  'gumball': '🔴',
}

export function readThemeColors(): ThemeColors {
  try {
    const style = getComputedStyle(document.documentElement)
    const pink = style.getPropertyValue('--pink').trim()
    const cyan = style.getPropertyValue('--cyan').trim()
    const darkBg = style.getPropertyValue('--dark-bg').trim()
    const deepPurple = style.getPropertyValue('--deep-purple').trim()

    return {
      sky: darkBg || DEFAULT_COLORS.sky,
      mountainFill: deepPurple || DEFAULT_COLORS.mountainFill,
      groundLine: pink || DEFAULT_COLORS.groundLine,
      groundGrid: pink ? `${pink}40` : DEFAULT_COLORS.groundGrid,
      scoreText: cyan || DEFAULT_COLORS.scoreText,
      uiText: cyan || DEFAULT_COLORS.uiText,
      uiGlow: cyan ? `${cyan}99` : DEFAULT_COLORS.uiGlow,
    }
  } catch {
    return DEFAULT_COLORS
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  config: GameConfig,
  colors: ThemeColors,
  blinkOn: boolean
): void {
  const { canvasWidth, canvasHeight, groundY } = config

  // Clear
  ctx.fillStyle = colors.sky
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)

  // Stars layer
  drawStars(ctx, state, colors)

  // Mountains layer
  drawMountains(ctx, state, config, colors)

  // Ground
  drawGround(ctx, state, config, colors)

  // Collectibles
  for (const c of state.collectibles) {
    if (c.collected) continue
    const bobY = c.y + Math.sin(c.frame * 0.08) * 4
    ctx.font = '16px serif'
    ctx.textAlign = 'center'
    ctx.fillText('🍬', c.x, bobY)
  }

  // Obstacles
  for (const obs of state.obstacles) {
    ctx.save()
    ctx.font = '24px serif'
    ctx.textAlign = 'center'

    if (obs.type === 'gumball') {
      ctx.translate(obs.x, obs.y - 12)
      ctx.rotate(obs.rotation)
      ctx.fillText(OBSTACLE_EMOJI[obs.type], 0, 0)
    } else {
      ctx.fillText(OBSTACLE_EMOJI[obs.type], obs.x, obs.y - 2)
    }
    ctx.restore()
  }

  // Lamb
  drawLamb(ctx, state, config)

  // Score
  ctx.font = '10px "Press Start 2P", monospace'
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.scoreText
  ctx.shadowColor = colors.uiGlow
  ctx.shadowBlur = 6
  ctx.fillText(`SCORE: ${String(Math.floor(state.score)).padStart(5, '0')}`, canvasWidth - 10, 20)
  ctx.shadowBlur = 0

  // Phase overlays
  if (state.phase === 'menu') {
    drawOverlay(ctx, canvasWidth, canvasHeight, groundY, colors, blinkOn, [
      { text: 'LAMB RUNNER', size: 14, y: groundY / 2 - 20 },
      { text: blinkOn ? 'PRESS SPACE TO START' : '', size: 8, y: groundY / 2 + 10 },
      { text: `HI: ${String(state.highScore).padStart(5, '0')}`, size: 8, y: groundY / 2 + 35 },
    ])
  } else if (state.phase === 'gameover') {
    // Dark overlay
    ctx.fillStyle = 'rgba(10, 0, 30, 0.75)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    drawOverlay(ctx, canvasWidth, canvasHeight, groundY, colors, blinkOn, [
      { text: 'GAME OVER', size: 14, y: groundY / 2 - 25 },
      { text: `SCORE: ${String(Math.floor(state.score)).padStart(5, '0')}`, size: 8, y: groundY / 2 + 5 },
      { text: `HI: ${String(state.highScore).padStart(5, '0')}`, size: 8, y: groundY / 2 + 25 },
      { text: blinkOn ? 'PRESS SPACE TO RETRY' : '', size: 7, y: groundY / 2 + 50 },
    ])
  }
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  colors: ThemeColors
): void {
  const { points, layer } = state.bgLayers.stars
  for (const star of points) {
    const x = ((star.x - layer.offset) % (ctx.canvas.width * 2) + ctx.canvas.width * 2) % (ctx.canvas.width * 2)
    if (x > ctx.canvas.width) continue
    ctx.globalAlpha = star.alpha
    ctx.fillStyle = colors.uiText
    ctx.fillRect(x, star.y, 1.5, 1.5)
  }
  ctx.globalAlpha = 1
}

function drawMountains(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  config: GameConfig,
  colors: ThemeColors
): void {
  const { peaks, layer } = state.bgLayers.mountains
  ctx.fillStyle = colors.mountainFill

  for (const peak of peaks) {
    const x = ((peak.x - layer.offset) % (config.canvasWidth * 2) + config.canvasWidth * 2) % (config.canvasWidth * 2)
    if (x + peak.width < -50 || x > config.canvasWidth + 50) continue

    ctx.beginPath()
    ctx.moveTo(x, config.groundY)
    ctx.lineTo(x + peak.width / 2, config.groundY - peak.height)
    ctx.lineTo(x + peak.width, config.groundY)
    ctx.closePath()
    ctx.fill()
  }
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  config: GameConfig,
  colors: ThemeColors
): void {
  const { canvasWidth, canvasHeight, groundY } = config
  const groundOffset = state.bgLayers.ground.layer.offset

  // Ground line
  ctx.strokeStyle = colors.groundLine
  ctx.lineWidth = 2
  ctx.shadowColor = colors.groundLine
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.moveTo(0, groundY)
  ctx.lineTo(canvasWidth, groundY)
  ctx.stroke()
  ctx.shadowBlur = 0

  // Grid dashes below ground
  ctx.strokeStyle = colors.groundGrid
  ctx.lineWidth = 1
  const dashSpacing = 30
  const offset = groundOffset % dashSpacing

  for (let x = -offset; x < canvasWidth + dashSpacing; x += dashSpacing) {
    ctx.beginPath()
    ctx.moveTo(x, groundY + 2)
    ctx.lineTo(x - 15, canvasHeight)
    ctx.stroke()
  }

  // Horizontal grid lines
  for (let y = groundY + 10; y < canvasHeight; y += 12) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvasWidth, y)
    ctx.stroke()
  }
}

function drawLamb(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  config: GameConfig
): void {
  const { lamb } = state
  ctx.save()
  ctx.font = '28px serif'
  ctx.textAlign = 'center'

  // Tilt during jump
  if (lamb.airborne) {
    ctx.translate(lamb.x, lamb.y - 14)
    ctx.rotate(lamb.vy * 0.02)
    ctx.fillText('🐑', 0, 0)
  } else {
    ctx.fillText('🐑', lamb.x, lamb.y - 2)
  }

  ctx.restore()

  // Death animation — tumble and fall if gameover
  if (state.phase === 'gameover' && state.frameCount < 30) {
    // brief red flash
    if (state.frameCount < 3) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.15)'
      ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight)
    }
  }
}

interface TextLine {
  text: string
  size: number
  y: number
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  _canvasHeight: number,
  _groundY: number,
  colors: ThemeColors,
  _blinkOn: boolean,
  lines: TextLine[]
): void {
  ctx.textAlign = 'center'
  ctx.shadowColor = colors.uiGlow
  ctx.shadowBlur = 10
  ctx.fillStyle = colors.uiText

  for (const line of lines) {
    if (!line.text) continue
    ctx.font = `${line.size}px "Press Start 2P", monospace`
    ctx.fillText(line.text, canvasWidth / 2, line.y)
  }

  ctx.shadowBlur = 0
}
