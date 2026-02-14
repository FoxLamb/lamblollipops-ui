# LambLollipops Roadmap

Feature roadmap for [lamblollipops.com](https://lamblollipops.com) -- a retro 90s vaporwave personal website built with React 19, TypeScript, Vite 6, and custom CSS.

*Last updated: February 2026*

---

## Current State

The site is a single-page experience with:

- Splash screen with animated lamb and "Click to Enter"
- Canvas-based animated starfield background with crescent moon and fireflies (night mode)
- Scrolling marquee tickers with time-of-day and holiday overrides
- Interactive lamb hero with click-to-sparkle effects, orbiting particles, sleeping/wake-on-click night mode, holiday costumes, and golden lamb rare event
- Cursor trail with 4 switchable styles (sparkles, hearts, lollipops, rainbow), toggle button, localStorage persistence, disabled on touch devices
- Dynamic seasonal/time-based theming: night mode (9pm-6am), morning/afternoon/evening palette shifts, 6 holidays with palette overrides + particle overlays + costume overlays + themed marquee text, weekend sunglasses mode, 1% golden lamb rare event
- Holiday particle overlays: snowflakes (Christmas), bats (Halloween), hearts (Valentine's), clovers (St. Patrick's), eggs (Easter), fiesta confetti (Cinco de Mayo)
- CSS variable-driven palette system with per-period and per-holiday color overrides applied at document root
- Embedded YouTube vaporwave radio stream
- Retro footer with webring placeholders, badges, and fake copyright
- Custom lollipop cursor, pixel fonts (Press Start 2P, VT323), neon vaporwave palette
- Two unused components already built: `GuestBook.tsx` (static entries) and `VisitorCounter.tsx` (fake counter)

Tech: React 19, TypeScript, Vite 6, custom CSS, self-hosted fonts. No backend, no routing, no state management library. Deployed to AWS S3 + CloudFront via GitHub Actions.

---

## Done

### 1. Cursor Trail Effects ✓

Sparkle/star trail that follows the mouse cursor. Pool of 25 recycled particles with `requestAnimationFrame` animation. Four switchable styles (sparkles, hearts, lollipops, rainbow) via a retro toggle button. Particles spawn at cursor, fade out with gravity. Disabled on touch devices. Style saved in localStorage.

### 2. Seasonal / Time-Based Content ✓

Dynamic site theming based on time of day, day of week, and holidays.

**Night Mode (9pm-6am):** Denser/brighter starfield, crescent moon, fireflies, muted palette, sleeping lamb with Zzz particles and wake-on-click yawn animation, whisper-style marquee.

**Daytime Variations:** Morning (sunrise warmth, greeting), Afternoon (default vaporwave), Evening (sunset tones, warmer pinks).

**Holidays:**
- Halloween (Oct 25-31): Pumpkin costume, orange/purple palette, bat particles
- Christmas (Dec 15-31): Santa hat costume, red/green palette, snowflake particles
- Valentine's Day (Feb 13-15): Heart costume, extra pink palette, heart particles
- St. Patrick's Day (Mar 15-17): Shamrock costume, green/gold palette, clover particles
- Easter (variable date, computed): Chick costume, pastel palette, egg particles
- Cinco de Mayo (May 3-5): Party costume, red/white/green palette, fiesta confetti

**Weekends:** Sunglasses costume, "It's the weekend!" marquee.

**Rare Events:** 1% chance golden lamb with pulsing gold glow and gold palette shift.

---

## Build Now

### 2a. Seasonal Enhancements

**What:** Deepen the seasonal system to touch every part of the site, add smooth transitions, and improve developer experience.

**Details:**

- **Seasonal splash screen:** Splash screen adapts to time of day and holidays -- sleeping lamb at night, costumes on holidays, themed button text, palette-aware colors
- **Smooth theme transitions:** CSS `@property` registrations enable 2-second palette crossfades between time periods instead of instant snaps
- **Seasonal cursor trail auto-matching:** New "auto" mode where the trail style automatically matches the active holiday (hearts for Valentine's, etc.) -- user can still override
- **Theme-aware starfield background:** Canvas clear color shifts with time of day (darker at night, warmer in morning/evening)
- **Dynamic real moon phases:** Moon in the night sky reflects actual lunar phase based on date, with brighter glow on full moon nights
- **Seasonal footer flair:** Footer gets seasonal notes and holiday-themed divider characters
- **Dev time override:** `localStorage.setItem('devTimeOverride', ...)` lets developers force any time period or holiday for testing

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
