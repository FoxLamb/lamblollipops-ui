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
├── App.tsx               # Main app (splash → site transition)
├── App.css               # All styles (~770 lines)
└── components/
    ├── SplashScreen.tsx   # "Click to Enter" landing
    ├── StarField.tsx      # Animated canvas starfield background
    ├── Marquee.tsx        # Scrolling ticker text
    ├── LambHero.tsx       # Interactive lamb emoji with sparkles
    ├── MusicPlayer.tsx    # YouTube vaporwave embed
    ├── GuestBook.tsx      # Static retro guestbook entries
    ├── VisitorCounter.tsx # Fake visitor counter
    └── Footer.tsx         # Webring, badges, copyright
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

## Infrastructure

- **S3:** Private bucket with OAC (origin access control)
- **CloudFront:** HTTPS, security headers (HSTS, CSP, X-Frame-Options), SPA routing (404/403 → index.html)
- **ACM:** Cert for lamblollipops.com + www
- **Route53:** A record (apex) + CNAME (www) → CloudFront
- **GitHub OIDC:** IAM role scoped to `FoxLamb/lamblollipops-ui:main`
- **Terraform state:** S3 backend in `fakedolphin-terraform-state-egykmlwl`
