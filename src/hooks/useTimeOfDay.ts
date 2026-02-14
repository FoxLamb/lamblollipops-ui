import { useState, useEffect } from 'react'

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night'

export type HolidayId = 'christmas' | 'halloween' | 'valentines' | 'newyear' | 'aprilfools'

export interface TimeOfDayState {
  period: TimePeriod
  activeHolidays: HolidayId[]
  isWeekend: boolean
  isGoldenLamb: boolean
}

function getPeriod(hour: number): TimePeriod {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}

function getActiveHolidays(month: number, day: number): HolidayId[] {
  const holidays: HolidayId[] = []

  // Christmas: Dec 15-31
  if (month === 12 && day >= 15 && day <= 31) {
    holidays.push('christmas')
  }

  // Halloween: Oct 25-31
  if (month === 10 && day >= 25 && day <= 31) {
    holidays.push('halloween')
  }

  // Valentine's Day: Feb 13-15
  if (month === 2 && day >= 13 && day <= 15) {
    holidays.push('valentines')
  }

  // New Year's: Dec 31 - Jan 2
  if ((month === 12 && day === 31) || (month === 1 && day <= 2)) {
    holidays.push('newyear')
  }

  // April Fools: Apr 1
  if (month === 4 && day === 1) {
    holidays.push('aprilfools')
  }

  return holidays
}

function getIsGoldenLamb(): boolean {
  const SESSION_KEY = 'goldenLambRoll'
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored !== null) {
      return stored === 'true'
    }
    // 1% chance
    const isGolden = Math.random() < 0.01
    sessionStorage.setItem(SESSION_KEY, String(isGolden))
    return isGolden
  } catch {
    return false
  }
}

function computeState(): TimeOfDayState {
  const now = new Date()
  const hour = now.getHours()
  const month = now.getMonth() + 1 // 1-based
  const day = now.getDate()
  const dayOfWeek = now.getDay() // 0=Sun, 6=Sat

  return {
    period: getPeriod(hour),
    activeHolidays: getActiveHolidays(month, day),
    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    isGoldenLamb: getIsGoldenLamb(),
  }
}

export function useTimeOfDay(): TimeOfDayState {
  const [state, setState] = useState<TimeOfDayState>(computeState)

  useEffect(() => {
    // Recompute every 5 minutes to catch period transitions
    const interval = setInterval(() => {
      setState(computeState())
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return state
}
