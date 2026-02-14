import { useMemo } from 'react'
import { useTimeOfDay, type TimePeriod, type HolidayId } from './useTimeOfDay'

export type LambMood =
  | 'default'
  | 'sleeping'
  | 'sunglasses'
  | 'santa'
  | 'pumpkin'
  | 'hearts'
  | 'party'
  | 'upsidedown'
  | 'golden'

export type DecorationParticleType =
  | 'snowflakes'
  | 'bats'
  | 'hearts'
  | 'confetti'
  | null

export interface StarfieldConfig {
  density: number
  brightness: number
  showMoon: boolean
  showFireflies: boolean
}

export interface SeasonalTheme {
  cssVariables: Record<string, string>
  starfieldConfig: StarfieldConfig
  lambMood: LambMood
  lambCostume: string | null
  marqueeOverride: string | null
  decorationParticles: DecorationParticleType
  isAprilFools: boolean
}

// --- Palette definitions ---

const NIGHT_VARS: Record<string, string> = {
  '--dark-bg': '#050014',
  '--deep-purple': '#0d001a',
  '--pink': '#c4609e',
  '--cyan': '#0199c4',
  '--purple': '#9050cc',
  '--yellow': '#ccc880',
  '--green': '#04c47d',
  '--border-glow': '#7a8ec4',
  '--text-primary': '#b8b0d8',
}

const MORNING_VARS: Record<string, string> = {
  '--dark-bg': '#1a0a2e',
  '--pink': '#ff8fba',
  '--yellow': '#ffd966',
  '--cyan': '#01cdfe',
}

const EVENING_VARS: Record<string, string> = {
  '--dark-bg': '#140020',
  '--pink': '#ff6b9e',
  '--cyan': '#00b8d4',
  '--yellow': '#ffb347',
  '--purple': '#cc66ff',
  '--border-glow': '#ff6b9e',
}

const CHRISTMAS_VARS: Record<string, string> = {
  '--pink': '#ff4444',
  '--cyan': '#00cc66',
  '--green': '#00cc66',
  '--yellow': '#ffd700',
  '--border-glow': '#ff4444',
}

const HALLOWEEN_VARS: Record<string, string> = {
  '--pink': '#ff6600',
  '--cyan': '#8833cc',
  '--purple': '#6b0099',
  '--yellow': '#ff9900',
  '--green': '#33cc33',
  '--border-glow': '#ff6600',
}

const VALENTINES_VARS: Record<string, string> = {
  '--pink': '#ff1493',
  '--cyan': '#ff69b4',
  '--purple': '#cc44aa',
  '--yellow': '#ffb6c1',
  '--border-glow': '#ff1493',
}

const NEWYEAR_VARS: Record<string, string> = {
  '--yellow': '#ffd700',
  '--cyan': '#c0c0c0',
  '--pink': '#ff71ce',
}

const GOLDEN_VARS: Record<string, string> = {
  '--pink': '#ffd700',
  '--cyan': '#ffec8b',
  '--purple': '#daa520',
  '--yellow': '#fff8dc',
  '--border-glow': '#ffd700',
}

// --- Marquee text by period ---

const PERIOD_MARQUEE: Record<TimePeriod, string | null> = {
  morning: '☀️ Good morning, sunshine! ☀️ Rise and shine with LambLollipops! ☀️ The early lamb gets the lollipop! ☀️ What a beautiful morning in cyberspace! ☀️',
  afternoon: null, // default text
  evening: '🌅 Good evening, traveler! 🌅 The sunset vibes are hitting different tonight! 🌅 Stay cozy in cyberspace! 🌅',
  night: '🌙 shhh... the lamb is sleeping... 🌙 tiptoeing through cyberspace... 🌙 sweet dreams and lollipop wishes... 🌙 the stars are out tonight... 🌙',
}

const HOLIDAY_MARQUEE: Record<HolidayId, string> = {
  christmas: '🎄 Merry Christmas from LambLollipops! 🎄 Ho ho ho! 🎅 Jingle all the way through cyberspace! 🎄 May your holidays be sweet! 🎄',
  halloween: '🎃 Happy Halloween! 🎃 Spooky lambs and haunted lollipops! 👻 Trick or treat in cyberspace! 🎃 Boo! 🎃',
  valentines: '💕 Happy Valentine\'s Day! 💕 Love is in the cyberspace air! 💕 Sending sweet lollipop kisses! 💕 Be mine, dear visitor! 💕',
  newyear: '🎆 Happy New Year! 🎆 Wishing you the sweetest year yet! 🎉 Party like it\'s 1999! 🎆 New year, new lollipops! 🎆',
  aprilfools: '🃏 Nothing is as it seems... 🃏 Or is it? 🃏 April Fools! Everything is upside down! 🃏 Trust no lamb! 🃏',
}

const WEEKEND_MARQUEE = '🎉 It\'s the weekend! 🎉 Time to party with LambLollipops! 🎉 No work, all vibes! 🎉 Weekend warrior mode activated! 🎉'

// --- Costume emojis ---

const HOLIDAY_COSTUMES: Record<HolidayId, string> = {
  christmas: '🎅',
  halloween: '🎃',
  valentines: '💘',
  newyear: '🎉',
  aprilfools: '🐺',
}

// --- Theme computation ---

function getStarfieldConfig(period: TimePeriod): StarfieldConfig {
  switch (period) {
    case 'night':
      return { density: 1.5, brightness: 1.3, showMoon: true, showFireflies: true }
    case 'evening':
      return { density: 1.2, brightness: 1.1, showMoon: false, showFireflies: false }
    case 'morning':
      return { density: 0.8, brightness: 0.9, showMoon: false, showFireflies: false }
    default:
      return { density: 1, brightness: 1, showMoon: false, showFireflies: false }
  }
}

function getLambMood(
  period: TimePeriod,
  holidays: HolidayId[],
  isWeekend: boolean,
  isGolden: boolean
): LambMood {
  // Golden lamb overrides everything
  if (isGolden) return 'golden'

  // Holiday costumes (priority: first active holiday wins)
  if (holidays.includes('aprilfools')) return 'upsidedown'
  if (holidays.includes('christmas')) return 'santa'
  if (holidays.includes('halloween')) return 'pumpkin'
  if (holidays.includes('valentines')) return 'hearts'
  if (holidays.includes('newyear')) return 'party'

  // Night mode
  if (period === 'night') return 'sleeping'

  // Weekend
  if (isWeekend) return 'sunglasses'

  return 'default'
}

function getLambCostume(holidays: HolidayId[], isWeekend: boolean): string | null {
  for (const h of holidays) {
    if (HOLIDAY_COSTUMES[h]) return HOLIDAY_COSTUMES[h]
  }
  if (isWeekend) return '😎'
  return null
}

function getDecorationParticles(holidays: HolidayId[]): DecorationParticleType {
  if (holidays.includes('christmas')) return 'snowflakes'
  if (holidays.includes('halloween')) return 'bats'
  if (holidays.includes('valentines')) return 'hearts'
  if (holidays.includes('newyear')) return 'confetti'
  return null
}

function getMarqueeOverride(
  period: TimePeriod,
  holidays: HolidayId[],
  isWeekend: boolean
): string | null {
  // Holidays take precedence
  for (const h of holidays) {
    if (HOLIDAY_MARQUEE[h]) return HOLIDAY_MARQUEE[h]
  }

  // Period-specific
  const periodText = PERIOD_MARQUEE[period]
  if (periodText) return periodText

  // Weekend (only if afternoon -- so it doesn't override morning/evening/night)
  if (isWeekend && period === 'afternoon') return WEEKEND_MARQUEE

  return null
}

function getCssVariables(
  period: TimePeriod,
  holidays: HolidayId[],
  isGolden: boolean
): Record<string, string> {
  let vars: Record<string, string> = {}

  // Base time-of-day palette
  switch (period) {
    case 'night':
      vars = { ...vars, ...NIGHT_VARS }
      break
    case 'morning':
      vars = { ...vars, ...MORNING_VARS }
      break
    case 'evening':
      vars = { ...vars, ...EVENING_VARS }
      break
  }

  // Holiday overrides (layered on top)
  if (holidays.includes('christmas')) vars = { ...vars, ...CHRISTMAS_VARS }
  if (holidays.includes('halloween')) vars = { ...vars, ...HALLOWEEN_VARS }
  if (holidays.includes('valentines')) vars = { ...vars, ...VALENTINES_VARS }
  if (holidays.includes('newyear')) vars = { ...vars, ...NEWYEAR_VARS }

  // Golden overrides everything
  if (isGolden) vars = { ...vars, ...GOLDEN_VARS }

  return vars
}

export function useSeasonalTheme(): SeasonalTheme {
  const { period, activeHolidays, isWeekend, isGoldenLamb } = useTimeOfDay()

  return useMemo(() => ({
    cssVariables: getCssVariables(period, activeHolidays, isGoldenLamb),
    starfieldConfig: getStarfieldConfig(period),
    lambMood: getLambMood(period, activeHolidays, isWeekend, isGoldenLamb),
    lambCostume: getLambCostume(activeHolidays, isWeekend),
    marqueeOverride: getMarqueeOverride(period, activeHolidays, isWeekend),
    decorationParticles: getDecorationParticles(activeHolidays),
    isAprilFools: activeHolidays.includes('aprilfools'),
  }), [period, activeHolidays, isWeekend, isGoldenLamb])
}
