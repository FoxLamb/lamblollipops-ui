import { useState, useCallback, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import StarField from './components/StarField'
import CursorTrail from './components/CursorTrail'
import HolidayOverlay from './components/HolidayOverlay'
import Marquee from './components/Marquee'
import LambHero from './components/LambHero'
import MusicPlayer from './components/MusicPlayer'
import LambRunner from './components/LambRunner/LambRunner'
import Footer from './components/Footer'
import { useSeasonalTheme } from './hooks/useSeasonalTheme'
import { usePetState } from './hooks/usePetState'

function App() {
  const [entered, setEntered] = useState(false)
  const theme = useSeasonalTheme()
  const { state: petState, mood: petMood, actions: petActions, feedCooldown } = usePetState()

  // Apply CSS variable overrides to document root (runs for both splash and main site)
  useEffect(() => {
    const root = document.documentElement
    const entries = Object.entries(theme.cssVariables)

    for (const [prop, value] of entries) {
      root.style.setProperty(prop, value)
    }

    return () => {
      for (const [prop] of entries) {
        root.style.removeProperty(prop)
      }
    }
  }, [theme.cssVariables])

  const handleEnter = useCallback(() => {
    setEntered(true)
  }, [])

  if (!entered) {
    return (
      <SplashScreen
        onEnter={handleEnter}
        lambMood={theme.lambMood}
        lambCostume={theme.lambCostume}
      />
    )
  }

  const { starfieldConfig, lambMood, lambCostume, marqueeOverride, decorationParticles, seasonalTrailStyle, footerNote, footerDivider } = theme

  return (
    <div className="site-wrapper">
      <StarField
        density={starfieldConfig.density}
        brightness={starfieldConfig.brightness}
        showMoon={starfieldConfig.showMoon}
        showFireflies={starfieldConfig.showFireflies}
        backgroundColor={starfieldConfig.backgroundColor}
        moonPhase={starfieldConfig.moonPhase}
      />
      <CursorTrail seasonalStyle={seasonalTrailStyle} />
      {decorationParticles && <HolidayOverlay type={decorationParticles} />}

      <MusicPlayer />

      <Marquee
        text="★ Welcome to LambLollipops! ★ The sweetest spot on the information superhighway! ★ Lambs and lollipops forever! ★ Maximum vibes detected! ★"
        overrideText={marqueeOverride}
      />

      <main className="main-content">
        <section className="section-box">
          <h2 className="section-title">~ About This Page ~</h2>
          <p className="retro-text">
            Welcome, weary traveler of the world wide web! You have stumbled upon
            <span className="highlight"> LambLollipops</span> — the most
            radical site on the internet! Here you will find lambs, lollipops,
            and vibes that transcend the boundaries of cyberspace.
          </p>
        </section>

        <LambRunner />

        <LambHero
          mood={lambMood}
          costume={lambCostume}
          petState={petState}
          petMood={petMood}
          petActions={petActions}
          feedCooldown={feedCooldown}
        />
      </main>

      <Marquee
        text="✦ Thanks for visiting LambLollipops! ✦ Come back soon! ✦ Don't forget to bookmark this page! ✦ Tell your friends! ✦ See you in cyberspace! ✦"
        overrideText={marqueeOverride}
      />

      <Footer seasonalNote={footerNote} footerDivider={footerDivider} />
    </div>
  )
}

export default App
