import { useMemo } from 'react'
import { useTimeOfDay, type TimePeriod, type HolidayId } from './useTimeOfDay'

export type LambMood =
  | 'default'
  | 'sleeping'
  | 'sunglasses'
  | 'santa'
  | 'pumpkin'
  | 'hearts'
  | 'shamrock'
  | 'bunny'
  | 'fiesta'
  | 'golden'

export type DecorationParticleType =
  | 'snowflakes'
  | 'bats'
  | 'hearts'
  | 'clovers'
  | 'eggs'
  | 'fiesta'
  | null

export type SeasonalTrailStyle = 'sparkles' | 'hearts' | 'lollipops' | 'rainbow' | null

export interface StarfieldConfig {
  density: number
  brightness: number
  showMoon: boolean
  showFireflies: boolean
  backgroundColor: string
  moonPhase: number // 0-1 float (0 = new moon, 0.5 = full moon)
}

export interface SeasonalTheme {
  cssVariables: Record<string, string>
  starfieldConfig: StarfieldConfig
  lambMood: LambMood
  lambCostume: string | null
  marqueeOverride: string | null
  decorationParticles: DecorationParticleType
  seasonalTrailStyle: SeasonalTrailStyle
  footerNote: string | null
  footerDivider: string
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

const STPATRICKS_VARS: Record<string, string> = {
  '--pink': '#00cc66',
  '--cyan': '#32cd32',
  '--purple': '#228b22',
  '--green': '#00ff7f',
  '--yellow': '#ffd700',
  '--border-glow': '#00cc66',
}

const EASTER_VARS: Record<string, string> = {
  '--pink': '#ffb6c1',
  '--cyan': '#87ceeb',
  '--purple': '#dda0dd',
  '--yellow': '#fffacd',
  '--green': '#98fb98',
  '--border-glow': '#dda0dd',
}

const CINCODEMAYO_VARS: Record<string, string> = {
  '--pink': '#ff4040',
  '--cyan': '#ffffff',
  '--purple': '#cc33cc',
  '--green': '#00a550',
  '--yellow': '#ffcc00',
  '--border-glow': '#ff4040',
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
  stpatricks: '☘️ Happy St. Patrick\'s Day! ☘️ Feeling lucky, are we? ☘️ May the lollipops be ever in your favor! ☘️ Top o\' the morning! ☘️',
  easter: '🐣 Happy Easter! 🐣 The Easter Lamb has arrived! 🥚 Egg hunt in cyberspace! 🐰 Hop along and find the lollipops! 🐣',
  cincodemayo: '🎊 Feliz Cinco de Mayo! 🎊 Viva LambLollipops! 🌮 Fiesta time in cyberspace! 🎉 Let\'s celebrate! 🎊',
}

const WEEKEND_MARQUEE = '🎉 It\'s the weekend! 🎉 Time to party with LambLollipops! 🎉 No work, all vibes! 🎉 Weekend warrior mode activated! 🎉'

// --- Costume emojis ---

const HOLIDAY_COSTUMES: Record<HolidayId, string> = {
  christmas: '🎅',
  halloween: '🎃',
  valentines: '💘',
  stpatricks: '☘️',
  easter: '🐣',
  cincodemayo: '🎊',
}

// --- Moon phase computation ---

// Known new moon reference: Jan 6, 2000 18:14 UTC
const NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14, 0)
const SYNODIC_MONTH_MS = 29.53058770576 * 24 * 60 * 60 * 1000

function getMoonPhase(): number {
  const now = Date.now()
  const daysSinceRef = (now - NEW_MOON_REF) / SYNODIC_MONTH_MS
  return daysSinceRef - Math.floor(daysSinceRef) // 0-1 fraction
}

// --- Seasonal trail style ---

function getSeasonalTrailStyle(holidays: HolidayId[], period: TimePeriod): SeasonalTrailStyle {
  if (holidays.includes('valentines')) return 'hearts'
  if (holidays.includes('halloween')) return 'lollipops'
  if (holidays.includes('christmas')) return 'sparkles'
  if (holidays.includes('stpatricks')) return 'rainbow'
  if (holidays.includes('easter')) return 'rainbow'
  if (holidays.includes('cincodemayo')) return 'rainbow'
  if (period === 'night') return 'sparkles'
  return null
}

// --- Footer content ---

const HOLIDAY_FOOTER_NOTES: Record<HolidayId, string> = {
  christmas: 'Wishing you a merry Christmas from the lamb',
  halloween: 'Beware of things that go baa in the night',
  valentines: 'The lamb sends you love and lollipops',
  stpatricks: 'May the luck of the lamb be with you',
  easter: 'Have an egg-cellent Easter weekend',
  cincodemayo: 'Viva la fiesta, viva los lollipops',
}

const PERIOD_FOOTER_NOTES: Record<TimePeriod, string | null> = {
  morning: 'A fresh morning in cyberspace',
  afternoon: null,
  evening: 'A cozy evening in cyberspace',
  night: 'A quiet night in cyberspace... the lamb dreams of lollipops',
}

const HOLIDAY_FOOTER_DIVIDERS: Record<HolidayId, string> = {
  christmas: '❄.:*~🎄~*:.❄ ❄.:*~🎄~*:.❄ ❄.:*~🎄~*:.❄',
  halloween: '🎃.:*~👻~*:.🎃 🎃.:*~👻~*:.🎃 🎃.:*~👻~*:.🎃',
  valentines: '💕.:*~❤️~*:.💕 💕.:*~❤️~*:.💕 💕.:*~❤️~*:.💕',
  stpatricks: '☘️.:*~🍀~*:.☘️ ☘️.:*~🍀~*:.☘️ ☘️.:*~🍀~*:.☘️',
  easter: '🐣.:*~🥚~*:.🐣 🐣.:*~🥚~*:.🐣 🐣.:*~🥚~*:.🐣',
  cincodemayo: '🎊.:*~🌮~*:.🎊 🎊.:*~🌮~*:.🎊 🎊.:*~🌮~*:.🎊',
}

const DEFAULT_FOOTER_DIVIDER = '·.:*~★~*:.· ·.:*~★~*:.· ·.:*~★~*:.·'

function getFooterNote(period: TimePeriod, holidays: HolidayId[]): string | null {
  for (const h of holidays) {
    if (HOLIDAY_FOOTER_NOTES[h]) return HOLIDAY_FOOTER_NOTES[h]
  }
  return PERIOD_FOOTER_NOTES[period]
}

function getFooterDivider(holidays: HolidayId[]): string {
  for (const h of holidays) {
    if (HOLIDAY_FOOTER_DIVIDERS[h]) return HOLIDAY_FOOTER_DIVIDERS[h]
  }
  return DEFAULT_FOOTER_DIVIDER
}

// --- Theme computation ---

function getStarfieldConfig(period: TimePeriod): StarfieldConfig {
  const moonPhase = getMoonPhase()
  // Full moon (near 0.5) gets a brightness boost
  const isFullMoonish = Math.abs(moonPhase - 0.5) < 0.1
  const fullMoonBoost = isFullMoonish ? 0.2 : 0

  switch (period) {
    case 'night':
      return {
        density: 1.5,
        brightness: 1.3 + fullMoonBoost,
        showMoon: true,
        showFireflies: true,
        backgroundColor: 'rgb(3, 0, 12)',
        moonPhase,
      }
    case 'evening':
      return {
        density: 1.2,
        brightness: 1.1,
        showMoon: false,
        showFireflies: false,
        backgroundColor: 'rgb(12, 2, 25)',
        moonPhase,
      }
    case 'morning':
      return {
        density: 0.8,
        brightness: 0.9,
        showMoon: false,
        showFireflies: false,
        backgroundColor: 'rgb(15, 5, 35)',
        moonPhase,
      }
    default:
      return {
        density: 1,
        brightness: 1,
        showMoon: false,
        showFireflies: false,
        backgroundColor: 'rgb(10, 0, 30)',
        moonPhase,
      }
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
  if (holidays.includes('christmas')) return 'santa'
  if (holidays.includes('halloween')) return 'pumpkin'
  if (holidays.includes('valentines')) return 'hearts'
  if (holidays.includes('stpatricks')) return 'shamrock'
  if (holidays.includes('easter')) return 'bunny'
  if (holidays.includes('cincodemayo')) return 'fiesta'

  // Night mode
  if (period === 'night') return 'sleeping'

  return 'default'
}

function getLambCostume(holidays: HolidayId[]): string | null {
  for (const h of holidays) {
    if (HOLIDAY_COSTUMES[h]) return HOLIDAY_COSTUMES[h]
  }
  return null
}

function getDecorationParticles(holidays: HolidayId[]): DecorationParticleType {
  if (holidays.includes('christmas')) return 'snowflakes'
  if (holidays.includes('halloween')) return 'bats'
  if (holidays.includes('valentines')) return 'hearts'
  if (holidays.includes('stpatricks')) return 'clovers'
  if (holidays.includes('easter')) return 'eggs'
  if (holidays.includes('cincodemayo')) return 'fiesta'
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
  if (holidays.includes('stpatricks')) vars = { ...vars, ...STPATRICKS_VARS }
  if (holidays.includes('easter')) vars = { ...vars, ...EASTER_VARS }
  if (holidays.includes('cincodemayo')) vars = { ...vars, ...CINCODEMAYO_VARS }

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
    lambCostume: getLambCostume(activeHolidays),
    marqueeOverride: getMarqueeOverride(period, activeHolidays, isWeekend),
    decorationParticles: getDecorationParticles(activeHolidays),
    seasonalTrailStyle: getSeasonalTrailStyle(activeHolidays, period),
    footerNote: getFooterNote(period, activeHolidays),
    footerDivider: getFooterDivider(activeHolidays),
  }), [period, activeHolidays, isWeekend, isGoldenLamb])
}
