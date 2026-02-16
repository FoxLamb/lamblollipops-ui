interface PetStatsProps {
  hunger: number
  happiness: number
  energy: number
}

function barColor(value: number): string {
  if (value > 60) return 'pet-bar--high'
  if (value > 30) return 'pet-bar--mid'
  return 'pet-bar--low'
}

export default function PetStats({ hunger, happiness, energy }: PetStatsProps) {
  const stats = [
    { label: '🍭 Hunger', value: hunger },
    { label: '💖 Happy', value: happiness },
    { label: '⚡ Energy', value: energy },
  ]

  return (
    <div className="pet-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="pet-stat-row">
          <span className="pet-stat-label">{stat.label}</span>
          <div
            className="pet-stat-track"
            role="progressbar"
            aria-valuenow={Math.round(stat.value)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${stat.label}: ${Math.round(stat.value)}%`}
          >
            <div
              className={`pet-stat-fill ${barColor(stat.value)}`}
              style={{ width: `${stat.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
