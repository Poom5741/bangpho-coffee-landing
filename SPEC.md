# Technical Spec: Bangpho Coffee-Beer Landing Page

## Problem Statement

Bangpho's first specialty coffee workspace needs a landing page to validate demand and collect 50+ email signups within 2 weeks. The page must be a stunning 3D scroll-driven experience that differentiates from generic landing pages, deployed to Cloudflare Pages with email signup functionality.

## Solution

A worldflight scroll-driven landing page built with Next.js 15 and the scrollcraft engine. The entire page is one continuous flight through the coffee workspace, from morning coffee to evening craft beer. Email signup via Resend API. KIE AI generated artwork for all visual assets.

## User Stories

1. As a digital nomad, I want to see a beautiful workspace hero image so that I immediately understand what this place offers
2. As a remote worker, I want to scroll through the page and feel the coffee workspace atmosphere so that I can imagine myself working there
3. As a visitor, I want to see the pain points of cafe-hopping named plainly so that I feel understood
4. As a potential customer, I want to see the solution (40 THB americano, 100+ Mbps WiFi, outlets) so that I know this solves my problems
5. As a coffee enthusiast, I want to see craft beer evening vibes so that I know this is more than just a workspace
6. As a visitor, I want to join the waitlist with my email so that I get opening day perks
7. As a mobile user, I want the scroll experience to work smoothly on my phone so that I can browse while commuting
8. As a visitor, I want to see pricing information so that I can evaluate if it fits my budget
9. As a visitor, I want to see the location (Bangpho, MRT Blue Line) so that I know if it's accessible
10. As a visitor, I want to see community events mentioned so that I know this is a social space
11. As a visitor, I want the page to load quickly (<3 seconds) so that I don't bounce
12. As a visitor, I want the scroll to feel natural and not jarring so that I enjoy the experience
13. As a visitor, I want to see real numbers (100+ Mbps, 40 THB, ฿350/hr) so that I trust the claims
14. As a visitor, I want to see the opening date so that I know when I can visit
15. As a visitor, I want to see what perks I get for joining the waitlist so that I'm motivated to sign up
16. As a visitor, I want the page to work without JavaScript for basic content so that I can read the key information
17. As a visitor, I want smooth transitions between sections so that the experience feels premium
18. As a visitor, I want to see the dual concept (coffee by day, beer by night) so that I understand the full offering
19. As a visitor, I want to see conference room information so that I know I can book meetings
20. As a visitor, I want the email signup to be simple (just email, no name required) so that I can quickly join

## Implementation Decisions

### Framework & Routing
- Next.js 15 with App Router (TypeScript, Tailwind CSS)
- Single page application — no routing needed
- API route for email signup at `/api/signup`

### Scroll Engine Integration
- Scrollcraft engine loaded as vanilla JS from `public/scrollcraft.js`
- Engine initialized via `useEffect` in the main page component
- CSS tokens overridden in `globals.css` for brand theming
- Worldflight mode: one fixed stage, continuous flight through 5 legs

### Worldflight Structure
- **Leg 1 (Hero):** Camera push-in on workspace scene, 40 THB americano visible
- **Leg 2 (Problem):** Crossfade to cafe-hopping frustration
- **Leg 3 (Solution):** Crossfade to bright workspace reveal
- **Leg 4 (Features):** Crossfade through coffee, beer, conference room details
- **Leg 5 (CTA):** Crossfade to community atmosphere, email signup

### Email Signup
- Resend API for email delivery and storage
- API route validates email format, calls Resend
- Success message: "Thanks! You're on the list. We'll send you opening day perks soon."
- Error message: "Please enter a valid email address."
- No database needed — Resend handles subscriber management

### Asset Generation
- KIE AI token: `099f8d7c7a281008c2a64dcdfd4cdd64`
- 5 poster images (one per worldflight leg) via `seedream/5-pro-text-to-image`
- Optional: 2 video clips via `kling/v2-1-pro` for hero and features
- Aspect ratio: 16:9 for desktop, 9:16 for mobile
- All assets in `public/assets/`

### Theming
- Scrollcraft CSS tokens overridden for coffee-beer brand:
  - `--sc-canvas: #1a1410` (warm dark brown)
  - `--sc-surface: #2a2018` (surface)
  - `--sc-ink: #f5e6d3` (cream text)
  - `--sc-ink-soft: #a2968a` (secondary text)
  - `--sc-accent: #d4a017` (craft beer gold)
  - `--sc-accent-ink: #1a1410` (text on accent)
- Fonts: Montserrat (display) + Open Sans (body) via Google Fonts

### Performance
- Target: <3 seconds load time
- Lazy load assets below fold
- Scrollcraft engine fetches video clips only when act approaches
- Reduced motion fallback (scrollcraft handles this)
- WebP format for all images

### Deployment
- Cloudflare Pages via `@cloudflare/next-on-pages`
- Continuous deployment from main branch
- Environment variables: `RESEND_API_KEY`, `KIE_AI_API_KEY`

## Testing Decisions

### What to test
- Email signup API: valid email succeeds, invalid email fails
- Page renders without JavaScript errors
- Scrollcraft engine initializes correctly
- Assets load and display
- Mobile responsive layout
- Reduced motion fallback works

### Test approach
- Manual verification via scrollcraft verification harness
- API route unit test with mock Resend client
- Playwright screenshot test at key scroll positions
- Lighthouse audit for performance

### Prior art
- Scrollcraft verification: `scripts/shoot.mjs` screenshots at every scroll position
- Next.js API route testing: standard Jest + mock fetch

## Out of Scope

- Facebook Pixel / GA4 tracking (placeholder only, implement after validation)
- Conference room booking system
- Multi-language support (English only)
- User authentication
- Database integration
- CMS for content management
- A/B testing framework
- Analytics dashboard

## Further Notes

- The scrollcraft engine is vanilla JS and must NOT be modified per project
- KIE AI assets are generated externally, not at build time
- The page must work without JavaScript for basic content (progressive enhancement)
- Mobile is a first-class target — test on real devices, not just browser dev tools
- The worldflight grammar means one continuous stage with no seams between sections
