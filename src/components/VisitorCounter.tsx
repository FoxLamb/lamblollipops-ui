import { useState, useEffect } from 'react'

export default function VisitorCounter() {
  const [count, setCount] = useState(48291)

  useEffect(() => {
    // Slowly increment counter for fun
    const interval = setInterval(() => {
      setCount(prev => prev + 1)
    }, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const digits = count.toString().padStart(6, '0').split('')

  return (
    <div className="visitor-counter">
      <p className="counter-label">You are visitor number:</p>
      <div className="counter-digits">
        {digits.map((digit, i) => (
          <span key={i} className="counter-digit">{digit}</span>
        ))}
      </div>
      <p className="counter-since">Since December 1996</p>
      <p className="last-updated">
        Page last updated: {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </div>
  )
}
