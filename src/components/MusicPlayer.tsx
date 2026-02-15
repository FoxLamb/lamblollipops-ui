import { useEffect, useRef, useState, useCallback } from 'react'

// YouTube IFrame API types
interface YTPlayer {
  playVideo: () => void
  pauseVideo: () => void
  getPlayerState: () => number
  setVolume: (vol: number) => void
  getVolume: () => number
  loadVideoById: (videoId: string) => void
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

// ── Playlist ──────────────────────────────────────────────
interface Track {
  id: string
  title: string
  artist: string
}

const PLAYLIST: Track[] = [
  { id: '2pApIwI3Nic', title: 'Vaporwave Mix', artist: 'VibesTV' },
  { id: 'aJOTlE1K90k', title: 'Synthwave Retro', artist: 'Astral Throb' },
  { id: '4xDzrJKXOOY', title: 'Synthwave Goose', artist: 'HOME' },
  { id: 'dQw4w9WgXcQ', title: 'Classic Vibes', artist: 'Rick Astley' },
]

// ── Skin system ───────────────────────────────────────────
interface SkinConfig {
  id: string
  name: string
  teamName: string
  title: string
}

const SKINS: SkinConfig[] = [
  { id: 'zunas', name: 'Hacker', teamName: ':: LambHax PATCH vol 1 v3.5 ::', title: 'LambHax PATCH vol 1 v3.5' },
  { id: 'void', name: 'Void', teamName: '[ LAMB VOID ]', title: 'LAMB LOLLIPOPS' },
  { id: 'orion', name: 'Classic', teamName: ':: TEAM LAMB 2026 ::', title: 'LambLollipops Vibe Cracker v1.8' },
  { id: 'fff', name: 'Chrome', teamName: 'by LambSoft', title: 'Lamb Generic Multi-Keygen' },
]

// ── Fake programs for the keygen dropdown ─────────────────
const FAKE_PROGRAMS = [
  'LambLollipops Pro v1.8.3',
  'Pasture Rendering Engine v11',
  'Wool Compression Toolkit',
  'Flock Dynamics Simulator',
  'Shepherd Command Line Utils',
  'Meadow Partition Manager',
  'Fleece Codec Pack v8.1',
  'Grazing Path Optimizer',
  'Lamb Kernel Debugger',
  'Herd Protocol Analyzer',
]

// ── Key generation ────────────────────────────────────────
const HEX_CHARS = '0123456789ABCDEF'
const ALPHA_NUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomChars(chars: string, len: number): string {
  let result = ''
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function generateSerial(): string {
  const formats = [
    () => `${randomChars(HEX_CHARS, 4)}-${randomChars(HEX_CHARS, 4)}-${randomChars(HEX_CHARS, 4)}-${randomChars(HEX_CHARS, 4)}`,
    () => `${randomChars(ALPHA_NUM, 5)}-${randomChars(ALPHA_NUM, 5)}-${randomChars(ALPHA_NUM, 5)}`,
    () => `${randomChars(HEX_CHARS, 4)}-${randomChars(ALPHA_NUM, 4)}-${randomChars(HEX_CHARS, 4)}-${randomChars(ALPHA_NUM, 4)}-${randomChars(HEX_CHARS, 4)}`,
    () => `LL${randomChars(HEX_CHARS, 2)}-${randomChars(ALPHA_NUM, 4)}-${randomChars(HEX_CHARS, 4)}-${randomChars(ALPHA_NUM, 3)}`,
  ]
  return formats[Math.floor(Math.random() * formats.length)]()
}

// ── Component ─────────────────────────────────────────────
export default function MusicPlayer() {
  const playerRef = useRef<YTPlayer | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [volume, setVolume] = useState(50)
  const [hasError, setHasError] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [skinIndex, setSkinIndex] = useState(0)
  const [generatedKey, setGeneratedKey] = useState('0000-0000-0000-0000')
  const [selectedProgram, setSelectedProgram] = useState(0)
  const [keyFlash, setKeyFlash] = useState(false)

  const currentSkin = SKINS[skinIndex]
  const currentTrack = PLAYLIST[currentTrackIndex]

  // ── YouTube callbacks ─────────────────────────────────
  const onPlayerReady = useCallback((event: YTPlayerEvent) => {
    setIsReady(true)
    event.target.setVolume(50)
    event.target.playVideo()
  }, [])

  const onPlayerStateChange = useCallback((event: YTPlayerEvent) => {
    const state = event.data
    if (state === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true)
      setHasError(false)
    } else if (state === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false)
    } else if (state === window.YT.PlayerState.ENDED) {
      setIsPlaying(false)
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length)
    }
  }, [])

  const onPlayerError = useCallback(() => {
    setHasError(true)
    setIsPlaying(false)
    // Auto-skip to next track on error after a brief pause
    setTimeout(() => {
      setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length)
    }, 1500)
  }, [])

  // ── Load YouTube API & create player ──────────────────
  useEffect(() => {
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
        videoId: PLAYLIST[0].id,
        width: '320',
        height: '180',
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

  // ── Track switching ───────────────────────────────────
  const switchTrack = useCallback((index: number) => {
    setHasError(false)
    if (!playerRef.current) return
    try {
      playerRef.current.loadVideoById(PLAYLIST[index].id)
      // Force play after short delays in case loadVideoById doesn't auto-play
      setTimeout(() => {
        try { playerRef.current?.playVideo() } catch { /* noop */ }
      }, 500)
    } catch {
      setHasError(true)
    }
  }, [])

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    switchTrack(currentTrackIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex])

  // ── Controls ──────────────────────────────────────────
  const togglePlay = () => {
    if (!playerRef.current || !isReady) return
    setHasError(false)
    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length)
  }

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length)
  }

  const handleVolume = (newVol: number) => {
    const clamped = Math.max(0, Math.min(100, newVol))
    setVolume(clamped)
    if (playerRef.current && isReady) {
      playerRef.current.setVolume(clamped)
    }
  }

  const cycleSkin = () => {
    setSkinIndex((prev) => (prev + 1) % SKINS.length)
  }

  const handleGenerate = () => {
    setGeneratedKey(generateSerial())
    setKeyFlash(true)
    setTimeout(() => setKeyFlash(false), 600)
  }

  const volumeIcon = volume === 0 ? '🔇' : volume < 40 ? '🔈' : volume < 70 ? '🔉' : '🔊'

  // ── Render ────────────────────────────────────────────
  return (
    <div className={`keygen-window keygen-skin--${currentSkin.id}`}>
      {/* Title bar */}
      <div className="keygen-titlebar">
        <span className="keygen-titlebar-icon">💊</span>
        <span className="keygen-titlebar-text">{currentSkin.title}</span>
        <div className="keygen-titlebar-buttons">
          <button
            className="keygen-titlebar-btn keygen-btn-skin"
            onClick={cycleSkin}
            title="Change Skin"
          >
            S
          </button>
          <button className="keygen-titlebar-btn keygen-btn-minimize" title="lol no">
            _
          </button>
          <button className="keygen-titlebar-btn keygen-btn-x" title="nice try">
            X
          </button>
        </div>
      </div>

      {/* Banner / logo area */}
      <div className="keygen-banner">
        <div className="keygen-banner-text">
          <span className="keygen-banner-title">LAMB</span>
          <span className="keygen-banner-title">LOLLIPOPS</span>
        </div>
        <div className="keygen-banner-tagline">where the vibes never stop</div>
        <div className="keygen-scanlines" />
      </div>

      {/* Track info display */}
      <div className="keygen-track-section">
        <div className="keygen-track-label">NOW PLAYING:</div>
        <div className="keygen-track-display">
          <span className="keygen-track-num">
            [{String(currentTrackIndex + 1).padStart(2, '0')}/{String(PLAYLIST.length).padStart(2, '0')}]
          </span>
          <span className="keygen-track-name">
            {currentTrack.artist} - {currentTrack.title}
          </span>
          {isPlaying && (
            <span className="keygen-eq-bars">
              <span className="keygen-eq-bar" />
              <span className="keygen-eq-bar" />
              <span className="keygen-eq-bar" />
              <span className="keygen-eq-bar" />
              <span className="keygen-eq-bar" />
            </span>
          )}
        </div>
      </div>

      {/* Music transport controls */}
      <div className="keygen-controls">
        <button
          className="keygen-ctrl-btn"
          onClick={prevTrack}
          disabled={!isReady}
          title="Previous Track"
        >
          |◄
        </button>
        <button
          className={`keygen-ctrl-btn keygen-ctrl-play ${isPlaying ? 'keygen-ctrl-active' : ''}`}
          onClick={togglePlay}
          disabled={!isReady}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '■' : '►'}
        </button>
        <button
          className="keygen-ctrl-btn"
          onClick={nextTrack}
          disabled={!isReady}
          title="Next Track"
        >
          ►|
        </button>

        <div className="keygen-volume">
          <span className="keygen-volume-icon">{volumeIcon}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolume(Number(e.target.value))}
            className="keygen-volume-slider"
            title={`Volume: ${volume}%`}
          />
        </div>
      </div>

      {/* Keygen serial section */}
      <div className="keygen-serial-section">
        <div className="keygen-field-row">
          <label className="keygen-label">Program:</label>
          <select
            className="keygen-select"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(Number(e.target.value))}
          >
            {FAKE_PROGRAMS.map((prog, i) => (
              <option key={i} value={i}>
                {prog}
              </option>
            ))}
          </select>
        </div>

        <div className="keygen-field-row">
          <label className="keygen-label">Serial:</label>
          <input
            className={`keygen-serial-input ${keyFlash ? 'keygen-serial-flash' : ''}`}
            type="text"
            readOnly
            value={generatedKey}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>

        <div className="keygen-btn-row">
          <button className="keygen-action-btn" onClick={handleGenerate}>
            Generate
          </button>
          <button
            className="keygen-action-btn"
            onClick={() => navigator.clipboard?.writeText(generatedKey)}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="keygen-statusbar">
        <span className="keygen-statusbar-team">{currentSkin.teamName}</span>
        <span className="keygen-statusbar-status">
          {hasError
            ? 'ERR: SIGNAL LOST'
            : isReady
              ? isPlaying
                ? 'PLAYING'
                : 'PAUSED'
              : 'LOADING...'}
        </span>
      </div>

      {/* Hidden YouTube player (audio only) */}
      <div className="keygen-yt-hidden" aria-hidden="true">
        <div ref={containerRef} />
      </div>
    </div>
  )
}
