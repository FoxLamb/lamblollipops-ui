import type { LambMood } from '../hooks/useSeasonalTheme'

interface SplashScreenProps {
  onEnter: () => void
  lambMood?: LambMood
  lambCostume?: string | null
}

function getButtonText(mood: LambMood): string {
  switch (mood) {
    case 'sleeping': return '★ Tiptoe Inside ★'
    case 'santa': return '★ Unwrap the Site ★'
    case 'pumpkin': return '★ Trick or Treat ★'
    case 'hearts': return '★ Open Your Heart ★'
    case 'shamrock': return '★ Try Your Luck ★'
    case 'bunny': return '★ Find the Eggs ★'
    case 'fiesta': return '★ Join the Fiesta ★'
    case 'golden': return '★ Enter the Golden Gate ★'
    default: return '★ Click to Enter ★'
  }
}

function getWarningText(mood: LambMood): string {
  switch (mood) {
    case 'sleeping': return '🌙 Warning: Lamb is sleeping — enter quietly 🌙'
    case 'golden': return '✨ Warning: You have been chosen ✨'
    default: return '⚠ Warning: Contains maximum vibes ⚠'
  }
}

export default function SplashScreen({ onEnter, lambMood = 'default', lambCostume = null }: SplashScreenProps) {
  const isSleeping = lambMood === 'sleeping'
  const isGolden = lambMood === 'golden'

  const lambClasses = [
    'splash-lamb',
    isSleeping ? 'splash-lamb--sleeping' : '',
    isGolden ? 'splash-lamb--golden' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="splash-screen">
      <div className="splash-stars" />
      <div className="splash-content">
        <div className="splash-lamb-wrapper">
          <div className={lambClasses}>🐑</div>
          {lambCostume && (
            <span className="splash-costume" aria-hidden="true">{lambCostume}</span>
          )}
          {isSleeping && (
            <div className="splash-zzz" aria-hidden="true">
              <span className="zzz-particle zzz-1">Z</span>
              <span className="zzz-particle zzz-2">z</span>
              <span className="zzz-particle zzz-3">Z</span>
            </div>
          )}
        </div>
        <h1 className="splash-title glow-text">LambLollipops</h1>
        <p className="splash-subtitle">.com</p>
        <div className="splash-divider">
          ·.:*~★~*:.· ·.:*~★~*:.·
        </div>
        <button className="enter-button" onClick={onEnter}>
          {getButtonText(lambMood)}
        </button>
        <p className={`splash-warning ${isSleeping ? '' : 'blink'}`}>
          {getWarningText(lambMood)}
        </p>
      </div>
    </div>
  )
}
