import { useState, useCallback } from 'react'
import SplashScreen from './components/SplashScreen'
import StarField from './components/StarField'
import Marquee from './components/Marquee'
import LambHero from './components/LambHero'
import MusicPlayer from './components/MusicPlayer'
import Footer from './components/Footer'

function App() {
  const [entered, setEntered] = useState(false)

  const handleEnter = useCallback(() => {
    setEntered(true)
  }, [])

  if (!entered) {
    return <SplashScreen onEnter={handleEnter} />
  }

  return (
    <div className="site-wrapper">
      <StarField />

      <header className="site-header">
        <div className="header-border">
          <h1 className="site-title glow-text">
            ~*~ LambLollipops ~*~
          </h1>
          <p className="subtitle blink">Welcome to my corner of the web!</p>
        </div>
      </header>

      <Marquee text="★ Welcome to LambLollipops! ★ The sweetest spot on the information superhighway! ★ Lambs and lollipops forever! ★ Maximum vibes detected! ★" />

      <main className="main-content">
        <section className="section-box">
          <h2 className="section-title">~ About This Page ~</h2>
          <p className="retro-text">
            Welcome, weary traveler of the world wide web! You have stumbled upon
            <span className="highlight"> LambLollipops</span> — the most
            radical site on the internet! Here you will find lambs, lollipops,
            and vibes that transcend the boundaries of cyberspace.
          </p>
          <p className="retro-text">
            This page has been lovingly hand-crafted with the finest HTML
            since the dawn of the internet age.
          </p>
        </section>

        <LambHero />

        <section className="section-box">
          <h2 className="section-title">~ The Vibe Zone ~</h2>
          <MusicPlayer />
        </section>
      </main>

      <Marquee text="✦ Thanks for visiting LambLollipops! ✦ Come back soon! ✦ Don't forget to bookmark this page! ✦ Tell your friends! ✦ See you in cyberspace! ✦" />

      <Footer />
    </div>
  )
}

export default App
