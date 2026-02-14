# LambLollipops Roadmap

Feature roadmap for [lamblollipops.com](https://lamblollipops.com) -- a retro 90s vaporwave personal website built with React 19, TypeScript, Vite 6, and custom CSS.

*Last updated: February 2026*

---

## Current State

The site is a single-page experience with:

- Splash screen with animated lamb and "Click to Enter"
- Canvas-based animated starfield background
- Scrolling marquee tickers
- Interactive lamb hero with click-to-sparkle effects and orbiting particles
- Embedded YouTube vaporwave radio stream
- Retro footer with webring placeholders, badges, and fake copyright
- Custom lollipop cursor, pixel fonts (Press Start 2P, VT323), neon vaporwave palette
- Two unused components already built: `GuestBook.tsx` (static entries) and `VisitorCounter.tsx` (fake counter)

Tech: React 19, TypeScript, Vite 6, custom CSS, self-hosted fonts. No backend, no routing, no state management library. Deployed to AWS S3 + CloudFront via GitHub Actions.

---

## Build Now

Six features approved for implementation, ordered by build sequence.

### 1. Cursor Trail Effects

**What:** Add a sparkle/star trail that follows the mouse cursor everywhere on the page. Classic 90s JavaScript effect.

**Details:**
- Trail of small sparkle particles (stars, hearts, lollipops, or rainbow dots) that follow the cursor
- Particles spawn at cursor position, then fade out and fall slightly with gravity
- Pool of ~20-30 particles recycled for performance
- Multiple trail styles available (sparkles, hearts, lollipops, rainbow)
- Small toggle button in a corner to switch styles or disable the trail
- Trail only active on desktop (disabled on touch devices)
- Style preference saved in localStorage

**Implementation notes:**
- New `CursorTrail.tsx` component rendered at the App level
- Use `requestAnimationFrame` for smooth animation
- Track mouse position via a throttled `mousemove` listener
- Absolute-positioned particles with CSS transitions for fade/fall
- Keep particle count capped to avoid performance issues

---

### 2. Seasonal / Time-Based Content

**What:** The site dynamically changes based on the time of day, day of week, and holidays. Night mode is the star feature.

**Details:**

**Night Mode (9pm - 6am local time):**
- Stars in the starfield get brighter and more numerous
- Background shifts to deeper, darker purple/navy
- The lamb is sleeping: eyes closed emoji, gentle snoring animation (Zzz floating up)
- Crescent moon and additional moon phases appear in the starfield
- Marquee text changes to whisper-style: "shhh... the lamb is sleeping..."
- Muted/softer neon glow on all elements (less saturated pinks, more blues)
- Subtle firefly particles floating slowly
- If the visitor interacts (clicks the lamb), it briefly wakes up, yawns, then goes back to sleep

**Daytime Variations:**
- Morning (6am-12pm): "Good morning!" greeting, sunrise gradient hints in background
- Afternoon (12pm-6pm): Standard vaporwave mode (current default)
- Evening (6pm-9pm): Sunset tones, warmer pinks and oranges mixed in

**Holidays:**
- Christmas (Dec 15-31): Santa hat on the lamb, snowflake particles mixed into starfield, red/green accent colors
- Halloween (Oct 25-31): Pumpkin on the lamb, orange/purple palette shift, bat particles
- Valentine's Day (Feb 13-15): Heart particles, extra pink everything, love-themed marquee messages
- New Year's (Dec 31 - Jan 2): Party hat, confetti particles, "Happy New Year!" banner
- April Fools (Apr 1): Everything is upside down, lamb is replaced with a wolf in sheep's clothing

**Weekends:**
- "It's the weekend!" special marquee messages
- Lamb wears sunglasses

**Rare Events:**
- 1% chance per visit of a "Golden Lamb" appearing -- sparkly gold version that triggers a special animation cascade

**Implementation notes:**
- New `useTimeOfDay` hook that returns current period (morning/afternoon/evening/night) and active holidays
- New `useSeasonalTheme` hook that computes CSS variable overrides and active decorations
- Modify `StarField.tsx` to accept density/brightness props driven by time of day
- Modify `LambHero.tsx` (or `LambPet.tsx`) to accept a mood/costume override from seasonal state
- CSS custom property overrides applied at the root level for palette shifts
- Holiday decorations as optional overlay components rendered conditionally
- Night mode is the highest priority within this feature -- implement it first, then layer in holidays

---

### 3. Lamb Tamagotchi / Virtual Pet

**What:** Transform the interactive lamb into a persistent virtual pet that remembers visitors between sessions.

**Details:**
- **Naming:** On first visit, prompt the visitor to name their lamb (stored in localStorage)
- **Moods:** Happy, hungry, sleepy, excited, sad -- each with a different emoji expression and animation style
- **Actions:**
  - Feed it lollipops (click a lollipop button, lamb does a happy chomp animation)
  - Pet it (click/drag on the lamb, hearts float up)
  - Play with it (click a ball, lamb bounces around)
- **Time awareness:**
  - Hunger increases over time (real clock). If not fed for 24h, lamb looks hungry
  - If not visited for a week+, lamb looks sad/lonely on return, perks up when interacted with
  - Energy decreases with play, recharges over real time
- **Stats panel:** Small retro status bar below the lamb showing hunger, happiness, energy as pixel-art bars
- **Persistence:** All state (name, mood, last visit, hunger level, happiness) stored in localStorage with timestamps

**Implementation notes:**
- Refactor `LambHero.tsx` into `LambPet.tsx` (or wrap it)
- New `PetStats.tsx` component for the status bars
- Pet state logic in a custom `usePetState` hook
- Calculate mood from hunger + happiness + time-since-last-visit on load
- Keep the existing sparkle-on-click interaction as the "pet" action

---

### 4. Retro Mini-Game: Lamb Runner

**What:** A simple side-scrolling endless runner game (like the Chrome dinosaur game) starring the lamb.

**Details:**
- **Gameplay:**
  - Lamb runs automatically from left to right
  - Tap/click or press Space to jump
  - Hold for higher jump
  - Obstacles: lollipop sticks, candy canes, rolling gumballs
  - Collectibles: floating lollipops for bonus points
  - Speed gradually increases
- **Visuals:**
  - Pixel art style matching the site aesthetic
  - Neon vaporwave color palette (pink ground, purple sky, cyan clouds)
  - Parallax scrolling background layers
  - Score counter in retro LCD font
- **Features:**
  - High score saved in localStorage
  - "Game Over" screen with score and "Play Again"
  - Accessible from a "Games" section on the main page or as a hidden easter egg
  - Runs in a canvas element, ~600x200px

**Implementation notes:**
- New `LambRunner/` component directory
- Canvas-based game loop with `requestAnimationFrame`
- Simple physics: gravity, jump velocity, collision detection (bounding box)
- Sprite-based rendering (can use emoji or simple geometric shapes for MVP)
- Game state machine: menu -> playing -> game over
- Keyboard (Space) and touch/click input handlers

---

### 5. Dial-Up Modem Entrance Sequence

**What:** When clicking "Enter" on the splash screen, simulate a dial-up modem connection before the main site loads.

**Details:**
- Play the iconic dial-up modem handshake sound (56k)
- Show a fake terminal/connection overlay with scrolling status messages:
  - `Initializing modem...`
  - `Dialing 1-800-LAMB-POP...`
  - `Authenticating with LambNet ISP...`
  - `Connected at 56kbps!`
  - `Loading LambLollipops...`
- Each line appears with a typewriter effect and a brief delay between lines
- Progress bar fills as messages scroll
- After the sequence completes (~4-5 seconds), transition into the main site with the existing fade-in
- Include a "Skip" link in the corner for repeat visitors
- Store a flag in localStorage so the full sequence only plays on first visit (shortened version on return visits)

**Implementation notes:**
- New `DialUpSequence.tsx` component inserted between splash screen and main site in `App.tsx`
- Dial-up audio as a small MP3/OGG in `/public/audio/`
- CSS animations for typewriter text and progress bar
- Manage sequence state with `useState` + `useEffect` timers

---

### 6. Winamp-Style Music Player

**What:** Replace the YouTube embed with a custom-built Winamp 2.x clone for playing vaporwave/lo-fi tracks.

**Details:**
- **Visual skin** matching classic Winamp 2.x:
  - Dark metallic frame with beveled edges
  - Green LED-style track title scroller
  - Play/Pause/Stop/Prev/Next buttons in the classic layout
  - Volume slider and balance slider
  - Time display (elapsed / remaining) in green LCD digits
  - Oscilloscope or spectrum visualizer bar (simplified, canvas-based)
- **Playlist window:** Toggle-able panel below the main player showing track list
  - Curated list of royalty-free vaporwave/lo-fi tracks (or YouTube audio)
  - Highlight current track, click to switch
- **EQ window:** Toggle-able, purely decorative (animated sliders that react to "music")
- **Draggable:** Click and drag the title bar to reposition anywhere on the page
- **Minimizable:** Double-click title bar to collapse to a slim bar
- **Persistent:** Position and current track saved in localStorage

**Implementation notes:**
- New `WinampPlayer/` component directory with sub-components (PlayerMain, Playlist, Visualizer)
- Use HTML5 `<audio>` element for playback with royalty-free tracks in `/public/audio/tracks/`
- Canvas-based visualizer using Web Audio API `AnalyserNode` for real frequency data
- CSS for the classic Winamp skin (pixel-perfect borders, beveled buttons, LCD font)
- Replace current `MusicPlayer.tsx` usage in `App.tsx`

---

## Future Backlog

Features approved in concept but deferred to a later phase.

### Windows 98 Desktop Mode (Konami Code Easter Egg)

Hidden behind the Konami Code (up up down down left right left right B A), the entire site transforms into a Windows 98 desktop. The lamb becomes a desktop icon, sections become draggable windows with title bars (minimize/maximize/close buttons), there's a Start menu, a taskbar with a clock, and a Recycle Bin. This is a large feature but would be an incredible shareable discovery.

### Real Guestbook with Backend

The `GuestBook.tsx` component already exists with 7 static entries. Wire it up to a real backend (Lambda + DynamoDB, or a free service like Giscus). Let visitors actually sign the guestbook with a name, message, and retro mood selector (90s emoticons). Show entries in a scrollable retro list with timestamps. Requires backend infrastructure.

### Theme Switcher: Eras of the Web

Let visitors switch between different retro web eras that completely reskin the site:
- **Vaporwave** (current default -- neon pink/cyan)
- **GeoCities 1997** (tiled background, Comic Sans, animated "under construction" GIF)
- **Matrix** (green on black, raining code, monospace everything)
- **Y2K Bubble** (iMac colors, rounded everything, Aqua buttons)
- **MySpace 2005** (glitter graphics, auto-playing music warning, "Top 8 Friends")

Saved in localStorage. Large scope -- each theme is essentially a full CSS reskin.

### Lamb Customizer

Let visitors dress up the lamb with accessories: sunglasses, a top hat, a lollipop, a boombox, a skateboard. Selections saved in localStorage so the custom lamb persists between visits. Shareable via URL params so you can send your lamb look to friends.

---

## Dropped

These were considered but decided against:
- Interactive ASCII Art Gallery
- Retro Sound Effects System
- Real Visitor Counter
- Working Web Ring
- "View Source" Button
