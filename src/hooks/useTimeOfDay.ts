import { useState, useEffect } from 'react'

export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night'

export type HolidayId = 'christmas' | 'halloween' | 'valentines' | 'stpatricks' | 'easter' | 'cincodemayo'

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

// Compute Easter Sunday for a given year using the Anonymous Gregorian algorithm
function getEasterDate(year: number): { month: number; day: number } {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

function isNearEaster(month: number, day: number, year: number): boolean {
  const easter = getEasterDate(year)
  // Convert both to day-of-year approximation for simple range check
  const easterApprox = easter.month * 31 + easter.day
  const currentApprox = month * 31 + day
  // Active from 2 days before to 1 day after Easter Sunday
  return currentApprox >= easterApprox - 2 && currentApprox <= easterApprox + 1
}

function getActiveHolidays(month: number, day: number, year: number): HolidayId[] {
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

  // St. Patrick's Day: Mar 15-17
  if (month === 3 && day >= 15 && day <= 17) {
    holidays.push('stpatricks')
  }

  // Easter: variable date (Fri before through Mon after)
  if (isNearEaster(month, day, year)) {
    holidays.push('easter')
  }

  // Cinco de Mayo: May 3-5
  if (month === 5 && day >= 3 && day <= 5) {
    holidays.push('cincodemayo')
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
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-based
  const day = now.getDate()
  const dayOfWeek = now.getDay() // 0=Sun, 6=Sat

  return {
    period: getPeriod(hour),
    activeHolidays: getActiveHolidays(month, day, year),
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
