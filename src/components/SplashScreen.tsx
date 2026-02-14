interface SplashScreenProps {
  onEnter: () => void
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  return (
    <div className="splash-screen">
      <div className="splash-stars" />
      <div className="splash-content">
        <div className="splash-lamb">🐑</div>
        <h1 className="splash-title glow-text">LambLollipops</h1>
        <p className="splash-subtitle">.com</p>
        <div className="splash-divider">
          ·.:*~★~*:.· ·.:*~★~*:.·
        </div>
        <button className="enter-button" onClick={onEnter}>
          ★ Click to Enter ★
        </button>
        <p className="splash-warning blink">
          ⚠ Warning: Contains music & maximum vibes ⚠
        </p>
        <p className="splash-browser">
          Best viewed with Netscape Navigator 4.0 at 800x600
        </p>
      </div>
    </div>
  )
}
