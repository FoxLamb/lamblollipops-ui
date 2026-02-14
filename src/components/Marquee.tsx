interface MarqueeProps {
  text: string
}

export default function Marquee({ text }: MarqueeProps) {
  return (
    <div className="marquee-container">
      <div className="marquee-track">
        <span className="marquee-text">{text}</span>
        <span className="marquee-text">{text}</span>
      </div>
    </div>
  )
}
