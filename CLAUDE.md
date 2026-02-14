# CLAUDE.md — LambLollipops UI

Retro 90s vaporwave static site for [lamblollipops.com](https://lamblollipops.com).

## Tech Stack

- **Framework:** React 19, TypeScript
- **Build:** Vite 6
- **Styling:** Custom CSS (no Tailwind) — neon vaporwave aesthetic with self-hosted pixel fonts (Press Start 2P, VT323)
- **Hosting:** S3 + CloudFront (via Terraform)
- **CI/CD:** GitHub Actions with OIDC authentication (no stored AWS keys)
- **Domain:** lamblollipops.com + www.lamblollipops.com
- **Dev port:** 3002

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Main app (splash → site transition, seasonal wiring)
├── App.css               # All styles (~1050 lines, includes @property registrations)
├── hooks/
│   ├── useTimeOfDay.ts   # Time period, holidays, weekend, golden lamb detection
│   └── useSeasonalTheme.ts # CSS vars, starfield config, mood, particles, trail, footer
└── components/
    ├── SplashScreen.tsx   # Seasonal "Click to Enter" landing
    ├── StarField.tsx      # Animated canvas starfield (moon phases, fireflies, themed bg)
    ├── CursorTrail.tsx    # Mouse trail with auto/manual styles (4 styles + auto + off)
    ├── HolidayOverlay.tsx # Holiday particle effects (snowflakes, bats, hearts, etc.)
    ├── Marquee.tsx        # Scrolling ticker with seasonal text override
    ├── LambHero.tsx       # Interactive lamb (sleeping, costumes, golden, sparkles)
    ├── MusicPlayer.tsx    # YouTube vaporwave embed
    ├── GuestBook.tsx      # Static retro guestbook entries (unused)
    ├── VisitorCounter.tsx # Fake visitor counter (unused)
    └── Footer.tsx         # Webring, badges, seasonal notes, holiday dividers
public/
├── favicon.svg           # Lamb emoji favicon
└── fonts/                # Self-hosted Google Fonts (woff2)
terraform/                # AWS infrastructure (S3, CloudFront, Route53, ACM, IAM)
.github/workflows/        # CI/CD (frontend deploy + infrastructure deploy)
```

## Commands

```bash
npm run dev        # Start dev server on port 3002
npm run build      # TypeScript check + Vite production build
npm run typecheck  # TypeScript only (no emit)
```

## Seasonal System

The site dynamically themes itself based on time of day, holidays, and rare events.

**Hook chain:** `useTimeOfDay` → `useSeasonalTheme` → `App.tsx` distributes config to all components.

**Time periods:** morning (6-12), afternoon (12-18), evening (18-21), night (21-6)

**Holidays:** Halloween, Christmas, Valentine's, St. Patrick's, Easter (computed), Cinco de Mayo

**Dev override** — test any state from the browser console:
```js
localStorage.setItem('devTimeOverride', JSON.stringify({ period: 'night' }))
localStorage.setItem('devTimeOverride', JSON.stringify({ holidays: ['christmas'] }))
localStorage.setItem('devTimeOverride', JSON.stringify({ period: 'night', holidays: ['halloween'], isGoldenLamb: true }))
localStorage.removeItem('devTimeOverride') // reset
```

## Infrastructure

- **S3:** Private bucket with OAC (origin access control)
- **CloudFront:** HTTPS, security headers (HSTS, CSP, X-Frame-Options), SPA routing (404/403 → index.html)
- **ACM:** Cert for lamblollipops.com + www
- **Route53:** A record (apex) + CNAME (www) → CloudFront
- **GitHub OIDC:** IAM role scoped to `FoxLamb/lamblollipops-ui:main`
- **Terraform state:** S3 backend in `fakedolphin-terraform-state-egykmlwl`
