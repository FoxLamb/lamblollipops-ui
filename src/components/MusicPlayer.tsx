import { useEffect, useRef, useState, useCallback } from 'react'

// YouTube IFrame API types
interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  getPlayerState: () => number
  setVolume: (vol: number) => void
  getVolume: () => number
  destroy: () => void
}

interface YTPlayerEvent {
  target: YTPlayer
  data: number
}

declare global {
  interface Window {
    YT: {
      Player: new (
        el: string | HTMLElement,
        config: {
          videoId: string
          height?: string
          width?: string
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (e: YTPlayerEvent) => void
            onStateChange?: (e: YTPlayerEvent) => void
            onError?: (e: YTPlayerEvent) => void
          }
        }
      ) => YTPlayer
      PlayerState: {
        PLAYING: number
        PAUSED: number
        BUFFERING: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady: () => void
  }
}

const VIDEO_ID = '2pApIwI3Nic'

export default function MusicPlayer() {
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [volume, setVolume] = useState(50)
  const [hasError, setHasError] = useState(false)

  const onPlayerReady = useCallback((event: YTPlayerEvent) => {
    setIsReady(true)
    event.target.setVolume(50)
    // Autoplay — splash screen click satisfies browser interaction requirement
    event.target.playVideo()
  }, [])

  const onPlayerStateChange = useCallback((event: YTPlayerEvent) => {
    const state = event.data
    if (state === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true)
    } else if (
      state === window.YT.PlayerState.PAUSED ||
      state === window.YT.PlayerState.ENDED
    ) {
      setIsPlaying(false)
    }
  }, [])

  const onPlayerError = useCallback(() => {
    setHasError(true)
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    // Load YouTube IFrame API
    const loadAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer()
        return
      }

      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScript = document.getElementsByTagName('script')[0]
      firstScript.parentNode?.insertBefore(tag, firstScript)

      window.onYouTubeIframeAPIReady = () => {
        createPlayer()
      }
    }

    const createPlayer = () => {
      if (!containerRef.current || playerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        width: '100%',
        height: '200',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      })
    }

    loadAPI()

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [onPlayerReady, onPlayerStateChange, onPlayerError])

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(100, newVol))
    setVolume(clamped)
    if (playerRef.current && isReady) {
      playerRef.current.setVolume(clamped)
    }
  }

  const volumeIcon = volume === 0 ? '🔇' : volume < 40 ? '🔈' : volume < 70 ? '🔉' : '🔊'

  return (
    <div className="music-player">
      <div className="youtube-section">
        <h3 className="youtube-title">📺 Vibes Corner 📺</h3>

        {/* Now Playing indicator */}
        <div className="now-playing-bar">
          {isPlaying ? (
            <>
              <span className="eq-bars">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </span>
              <span className="now-playing-text">NOW PLAYING</span>
              <span className="eq-bars">
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
                <span className="eq-bar" />
              </span>
            </>
          ) : (
            <span className="now-playing-text">
              {hasError ? 'SIGNAL LOST' : isReady ? 'PAUSED' : 'TUNING IN...'}
            </span>
          )}
        </div>

        {/* Video embed (YT API takes over this div) */}
        <div className="youtube-embed">
          <div ref={containerRef} />
        </div>

        {/* Retro controls */}
        <div className="player-controls">
          <button
            className={`player-btn player-btn--play ${isPlaying ? 'player-btn--active' : ''}`}
            onClick={togglePlay}
            disabled={!isReady}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className="volume-control">
            <span className="volume-icon">{volumeIcon}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolume(Number(e.target.value))}
              className="volume-slider"
              title={`Volume: ${volume}%`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
