# LambLollipops UI

Retro 90s vaporwave website for [lamblollipops.com](https://lamblollipops.com).

## Features

- **Splash screen** with animated lamb and "Click to Enter" — seasonal-aware (themed button text, costumes, sleeping lamb at night)
- **Animated starfield** background with twinkling stars, crescent moon with real lunar phases (night), and fireflies
- **Cursor trail** with 4 styles (sparkles, hearts, lollipops, rainbow) + auto mode that matches the current holiday/time of day
- **Seasonal theming** — the entire site changes based on time of day (morning/afternoon/evening/night) and holidays
- **Night mode** (9pm-6am) — sleeping lamb with Zzz, muted palette, brighter stars, moon, fireflies, whisper marquee
- **6 holidays** with palette overrides, costume overlays, particle effects, and themed marquee/footer text:
  - Halloween, Christmas, Valentine's Day, St. Patrick's Day, Easter, Cinco de Mayo
- **Weekend mode** — sunglasses lamb, weekend marquee
- **Golden lamb** — 1% rare event with gold glow cascade
- **Smooth theme transitions** — 2-second palette crossfade via CSS `@property` registrations
- **Interactive lamb** with click-to-sparkle effects and orbiting particles
- **YouTube vaporwave radio** stream embed
- **Retro footer** with webring placeholders, seasonal notes, holiday-themed dividers

## Development

```bash
npm install
npm run dev    # http://localhost:3002
npm run build  # Production build
```

### Dev Time Override

Test any seasonal state without waiting for the calendar:

```js
// In browser console:
localStorage.setItem('devTimeOverride', JSON.stringify({ period: 'night' }))
localStorage.setItem('devTimeOverride', JSON.stringify({ holidays: ['christmas'] }))
localStorage.setItem('devTimeOverride', JSON.stringify({ period: 'night', holidays: ['halloween'], isGoldenLamb: true }))

// Remove override:
localStorage.removeItem('devTimeOverride')
```

Refresh the page after setting the override.

## Deployment

### First-time setup

1. Apply Terraform to create AWS infrastructure:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```

2. Note the outputs — set these in the GitHub repo:
   - **Secret** `AWS_ROLE_ARN` = the `github_actions_role_arn` output
   - **Variable** `S3_BUCKET` = the `s3_bucket_name` output
   - **Variable** `CLOUDFRONT_DISTRIBUTION_ID` = the `cloudfront_distribution_id` output

3. Push to `main` — GitHub Actions handles the rest.

### How it works

- Push to `main` (src/public changes) → builds with Vite → syncs to S3 → invalidates CloudFront
- Push to `main` (terraform changes) → plans Terraform → requires manual approval → applies
- Authentication via GitHub OIDC (no stored AWS keys)
