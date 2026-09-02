# Architecture Plan: Bangpho Coffee-Beer Landing Page

## Scope Gate
**Target:** New project — full landing page build from scratch
**Complexity:** ~12 files, 1 new service (Resend API), 1 integration (KIE AI)
**Decision:** Proceed — scope is proportionate for a landing page

---

## Step 0: Scope Challenge

### What exists already?
- `06-validation/landing-page-requirements.md` — full content spec (973 lines)
- `BRIEF.md` — scrollcraft brief with feeling curve and journey
- `scrollcraft engine` — vanilla JS + CSS (copied to public/)
- Next.js 15 project scaffolded with TypeScript + Tailwind

### Minimum viable changes
1. Single page app with worldflight scroll experience
2. Email signup API route (Resend)
3. KIE AI asset generation for backgrounds
4. Cloudflare Pages deployment config

### What can be deferred?
- Facebook Pixel / GA4 tracking (placeholder only)
- Conference room booking (not in scope for validation)
- Multi-language support (English only for now)

---

## Architecture

```
landing-page/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout, fonts, metadata
│       ├── page.tsx            # Main landing page (worldflight)
│       ├── globals.css         # Tailwind + scrollcraft tokens
│       └── api/
│           └── signup/
│               └── route.ts    # Resend email signup endpoint
├── public/
│   ├── scrollcraft.js          # Engine (vanilla JS, untouched)
│   ├── scrollcraft.css         # Engine styles (vanilla CSS, untouched)
│   └── assets/                 # KIE AI generated artwork
│       ├── hero-poster.webp
│       ├── problem-poster.webp
│       ├── solution-poster.webp
│       ├── features-poster.webp
│       └── cta-poster.webp
├── next.config.ts
├── wrangler.toml               # Cloudflare Pages config
├── package.json
└── tsconfig.json
```

### Data Flow

```
User scrolls → scrollcraft.js reads scroll position
             → drives --sc-p CSS property
             → worldflight engine crossfades legs
             → KIE AI posters/videos display
             → user reaches CTA → enters email
             → POST /api/signup → Resend API → email stored
             → success message displayed
```

### Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Framework | Next.js 15 App Router | SSR for SEO, API routes for signup, Cloudflare adapter |
| Scroll engine | scrollcraft (vanilla) | Proven methodology, no React overhead, direct DOM control |
| Email | Resend | Simple API, generous free tier, Cloudflare-compatible |
| Assets | KIE AI (seedream + kling) | User provided token, photoreal quality |
| Deploy | Cloudflare Pages | User's choice, edge performance |
| Fonts | Montserrat + Open Sans | Per requirements, Google Fonts |

### Boundary Rules

- **Scrollcraft engine:** NEVER edit `scrollcraft.js` or `scrollcraft.css`. Theme via CSS tokens in `globals.css`. Bespoke JS in page components only.
- **API route:** Stateless, no database. Resend handles email storage.
- **Assets:** Generated externally (KIE AI), placed in `public/assets/`. No runtime generation.
- **No client-side state management:** Single page, no React state needed. Scroll state is managed by scrollcraft engine.

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| KIE AI token invalid | Low | High | Test with `kie.mjs probe` first |
| Scrollcraft breaks on Next.js | Low | Medium | Engine is vanilla JS, should work as-is |
| Resend free tier limit (100/day) | Medium | Low | Sufficient for validation (50 signups target) |
| Cloudflare Pages build fails | Low | Medium | Test locally with `next build` first |
| Mobile scroll performance | Medium | Medium | Reduced motion fallback, lazy load assets |

---

## File Manifest

| File | Action | Purpose |
|------|--------|---------|
| `src/app/layout.tsx` | Create | Root layout with fonts, metadata |
| `src/app/page.tsx` | Create | Main worldflight landing page |
| `src/app/globals.css` | Create | Tailwind + scrollcraft token overrides |
| `src/app/api/signup/route.ts` | Create | Resend email signup endpoint |
| `public/scrollcraft.js` | Copy | Scrollcraft engine (untouched) |
| `public/scrollcraft.css` | Copy | Scrollcraft styles (untouched) |
| `public/assets/*` | Generate | KIE AI artwork (5 poster images) |
| `wrangler.toml` | Create | Cloudflare Pages config |
| `next.config.ts` | Modify | Add Cloudflare adapter |
| `.env.local` | Create | RESEND_API_KEY, KIE_AI_API_KEY |
| `BRIEF.md` | Create | Scrollcraft brief (done) |

**Total: 11 files to create/modify**
