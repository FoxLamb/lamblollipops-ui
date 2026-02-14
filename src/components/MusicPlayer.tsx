export default function MusicPlayer() {
  return (
    <div className="music-player">
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
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: '3px solid #ff71ce', borderRadius: '4px' }}
          />
        </div>
      </div>
    </div>
  )
}
