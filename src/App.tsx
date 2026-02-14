import { useState, useRef, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import StarField from './components/StarField'
import Marquee from './components/Marquee'
import LambHero from './components/LambHero'
import VisitorCounter from './components/VisitorCounter'
import GuestBook from './components/GuestBook'
import MusicPlayer from './components/MusicPlayer'
import Footer from './components/Footer'

function App() {
  const [entered, setEntered] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleEnter = useCallback(() => {
    setEntered(true)
    // Try to autoplay music after user interaction
    setTimeout(() => {
      audioRef.current?.play().catch(() => {
        // Browser may still block — that's fine, user can click play
      })
    }, 500)
  }, [])

  if (!entered) {
    return <SplashScreen onEnter={handleEnter} />
  }

  return (
    <div className="site-wrapper">
      <StarField />
      <audio ref={audioRef} src="/audio/vaporwave.mp3" loop preload="auto" />

      <header className="site-header">
        <div className="header-border">
          <h1 className="site-title glow-text">
            ~*~ LambLollipops ~*~
          </h1>
          <p className="subtitle blink">Welcome to my corner of the web!</p>
        </div>
      </header>

      <Marquee text="★ Welcome to LambLollipops! ★ The sweetest spot on the information superhighway! ★ You are visitor #48,291! ★ Best viewed at 800x600 ★ Netscape Navigator recommended ★" />

      <main className="main-content">
        <section className="section-box">
          <h2 className="section-title">~ About This Page ~</h2>
          <div className="construction-banner">
            <span className="blink">🚧</span>
            <span className="construction-text">UNDER CONSTRUCTION</span>
            <span className="blink">🚧</span>
          </div>
          <p className="retro-text">
            Welcome, weary traveler of the world wide web! You have stumbled upon
            <span className="highlight"> LambLollipops</span> — the most
            radical site on the internet! Here you will find lambs, lollipops,
            and vibes that transcend the boundaries of cyberspace.
          </p>
          <p className="retro-text">
            This page has been lovingly hand-crafted with the finest HTML
            since the dawn of the internet age. Please sign my guestbook
            before you leave!
          </p>
        </section>

        <LambHero />

        <section className="section-box">
          <h2 className="section-title">~ The Vibe Zone ~</h2>
          <MusicPlayer audioRef={audioRef} />
        </section>

        <section className="section-box">
          <h2 className="section-title">~ Cool Links ~</h2>
          <div className="links-grid">
            <a href="https://foxlamb.com" className="retro-link" target="_blank" rel="noopener noreferrer">
              🦊 FoxLamb
            </a>
            <a href="https://www.cameronsworld.net/" className="retro-link" target="_blank" rel="noopener noreferrer">
              🌐 Cameron's World
            </a>
            <a href="https://wiby.me/" className="retro-link" target="_blank" rel="noopener noreferrer">
              🔍 Wiby Search
            </a>
            <a href="https://theoldnet.com/" className="retro-link" target="_blank" rel="noopener noreferrer">
              📼 The Old Net
            </a>
            <a href="https://poolsuite.net/" className="retro-link" target="_blank" rel="noopener noreferrer">
              🏊 Poolsuite FM
            </a>
            <a href="https://neal.fun/" className="retro-link" target="_blank" rel="noopener noreferrer">
              🎮 Neal.fun
            </a>
          </div>
        </section>

        <GuestBook />

        <VisitorCounter />
      </main>

      <Marquee text="✦ Thanks for visiting LambLollipops! ✦ Come back soon! ✦ Don't forget to bookmark this page! ✦ Tell your friends! ✦ See you in cyberspace! ✦" />

      <Footer />
    </div>
  )
}

export default App
