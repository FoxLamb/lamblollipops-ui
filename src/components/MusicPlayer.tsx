import { useState, useEffect, type RefObject } from 'react'

interface MusicPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>
}

export default function MusicPlayer({ audioRef }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [audioRef, volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <div className="music-player">
      <div className="player-controls">
        <div className="player-label">🎵 Now Playing: Vaporwave Dreams 🎵</div>
        <div className="player-buttons">
          <button className="player-btn" onClick={togglePlay}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <div className="volume-control">
            <span className="volume-label">Vol:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolume}
              className="volume-slider"
            />
          </div>
        </div>
        <p className="player-note">
          {isPlaying ? '♪ ♫ ♪ Vibing... ♪ ♫ ♪' : 'Click play to start the vibes'}
        </p>
      </div>

      <div className="youtube-section">
        <h3 className="youtube-title">📺 Vibes Corner 📺</h3>
        <p className="retro-text" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          Tune in to the vaporwave aesthetic
        </p>
        <div className="youtube-embed">
          <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/aQkPcPqTq4M?si=placeholder"
            title="Vaporwave Radio"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: '3px solid #ff71ce', borderRadius: '4px' }}
          />
        </div>
      </div>
    </div>
  )
}
