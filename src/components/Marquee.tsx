interface MarqueeProps {
  text: string
  overrideText?: string | null
}

export default function Marquee({ text, overrideText }: MarqueeProps) {
  const displayText = overrideText || text

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        <span className="marquee-text">{displayText}</span>
        <span className="marquee-text">{displayText}</span>
      </div>
    </div>
  )
}
