import { useMemo } from 'react'
import type { DecorationParticleType } from '../hooks/useSeasonalTheme'

interface HolidayOverlayProps {
  type: NonNullable<DecorationParticleType>
}

interface ParticleConfig {
  count: number
  chars: string[]
  className: string
  durationRange: [number, number] // seconds [min, max]
  isConfetti?: boolean
}

const PARTICLE_CONFIGS: Record<NonNullable<DecorationParticleType>, ParticleConfig> = {
  snowflakes: {
    count: 30,
    chars: ['❄', '❅', '❆', '✻', '✼'],
    className: 'holiday-particle--snowflake',
    durationRange: [6, 14],
  },
  bats: {
    count: 12,
    chars: ['🦇'],
    className: 'holiday-particle--bat',
    durationRange: [8, 16],
  },
  hearts: {
    count: 20,
    chars: ['❤️', '💕', '💖', '💗', '💘', '💝'],
    className: 'holiday-particle--heart',
    durationRange: [7, 15],
  },
  confetti: {
    count: 40,
    chars: [],
    className: 'holiday-particle--confetti',
    durationRange: [4, 10],
    isConfetti: true,
  },
}

const CONFETTI_COLORS = [
  '#ff71ce', '#01cdfe', '#b967ff', '#fffb96', '#05ffa1',
  '#ff4444', '#ffd700', '#ff69b4', '#00ff88', '#ff8c00',
]

export default function HolidayOverlay({ type }: HolidayOverlayProps) {
  const config = PARTICLE_CONFIGS[type]

  const particles = useMemo(() => {
    return Array.from({ length: config.count }, (_, i) => {
      const duration = config.durationRange[0] + Math.random() * (config.durationRange[1] - config.durationRange[0])
      const delay = Math.random() * duration // stagger start times
      const left = Math.random() * 100 // percent
      const char = config.isConfetti
        ? ''
        : config.chars[Math.floor(Math.random() * config.chars.length)]
      const bgColor = config.isConfetti
        ? CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
        : undefined
      const size = config.isConfetti
        ? 4 + Math.random() * 6
        : undefined

      return { id: i, duration, delay, left, char, bgColor, size }
    })
  }, [config])

  return (
    <div className="holiday-overlay" aria-hidden="true">
      {particles.map(p => (
        <span
          key={p.id}
          className={`holiday-particle ${config.className}`}
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
            ...(p.bgColor ? { backgroundColor: p.bgColor } : {}),
            ...(p.size ? { width: `${p.size}px`, height: `${p.size}px`, borderRadius: '2px' } : {}),
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  )
}
