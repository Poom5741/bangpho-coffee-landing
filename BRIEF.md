# BRIEF: Bangpho Coffee-Beer Landing Page

**Self-authored, not interviewed** — requirements from `06-validation/landing-page-requirements.md`

## 1. What is this, and who is it for?

A scroll-driven landing page for Bangpho's first specialty coffee workspace (coffee-beer hybrid). Validates demand by collecting email signups from digital nomads, remote workers, and coffee enthusiasts in Bangkok.

## 2. What must the visitor believe by the end?

"Bangpho has a reliable, affordable workspace where I can work all day and stay for craft beer."

## 3. What does the visitor do next?

Join the waitlist (email signup).

## 4. What do we already have?

- Detailed requirements doc (06-validation/landing-page-requirements.md)
- Brand palette: brown #6B4423, green #2C5F2D, cream #F5E6D3, gold #D4A017
- KIE AI token for artwork generation: 099f8d7c7a281008c2a64dcdfd4cdd64
- No existing code, photos, or footage — fully generated world

## 5. Art direction

Photographic world (not illustrated). Warm, natural, authentic. The workspace should feel real: coffee, laptops, outlets, craft beer, community. KIE AI generated artwork for hero and section backgrounds.

---

## Feeling Curve

| Beat | Emotion | What causes it |
|------|---------|----------------|
| 1. Recognition | "This is my morning" | Hero: beautiful workspace, coffee steam, laptop open, natural light |
| 2. Tension | "That's exactly my problem" | Pain points: bad WiFi, no outlets, no meeting rooms |
| 3. Turn | "Wait, this exists?" | The reveal: 40 THB americano, 100+ Mbps, outlets everywhere |
| 4. Substance | "This actually works" | Features: conference rooms, craft beer evenings, community |
| 5. Commitment | "I want in" | CTA: Join the waitlist, opening day perks |

**Peak:** Beat 3 (Turn) — the moment they realize Bangpho has what they've been cafe-hopping for. Gets the most scroll room and the strongest visual.

**Tell-someone sentence:** "It's the site where I found out Bangpho has a 40 THB americano workspace with real WiFi."

---

## Journey (scrollcraft beats)

1. **Recognition** — Hero: continuous worldflight opens on a beautiful workspace scene, camera slowly pushing in
2. **Tension** — Pain points crossfade in: the cafe-hopping struggle, named plainly
3. **Turn** — The solution reveal: 40 THB, 100+ Mbps, outlets at every seat
4. **Substance** — Features pan across: conference rooms, craft beer, community events
5. **Commitment** — CTA: Join the waitlist with opening day perks

---

## Scroll Score (worldflight grammar)

| Segment | Device | Why |
|---------|--------|-----|
| Hero | worldflight leg (scrub) | Camera push-in on workspace establishes the world |
| Problem | worldflight leg (crossfade) | Shift to cafe-hopping frustration |
| Solution | worldflight leg (crossfade) | The workspace reveal, brighter, warmer |
| Features | worldflight leg (crossfade) | Detail shots: coffee, beer, conference room |
| CTA | worldflight leg (crossfade) | Final hold on community atmosphere |

**Grammar:** Worldflight — one continuous stage, no seams, crossfade between legs.
**Signature move:** The entire page is one unbroken flight through the coffee workspace, from morning coffee to evening craft beer.

---

## Technical Stack

- **Framework:** Next.js 15 (App Router, TypeScript, Tailwind CSS)
- **Scroll engine:** scrollcraft (vanilla JS, adapted for Next.js)
- **Email:** Resend API
- **Deploy:** Cloudflare Pages
- **Artwork:** KIE AI (token: 099f8d7c7a281008c2a64dcdfd4cdd64)
- **Tracking:** Facebook Pixel + GA4 (placeholder)

---

## Content (from requirements)

**Hero headline:** Bangpho's First Specialty Coffee Workspace
**Subheadline:** Guaranteed 100+ Mbps WiFi. Outlets at every seat. Bookable conference rooms. 40 THB americano. Work all day, stay for craft beer.

**Pain points:** Unreliable WiFi, No Outlets, No Meeting Rooms
**Features:** WiFi, Outlets, Conference Rooms, 40 THB Coffee, Craft Beer, Community
**Pricing:** Day Pass ฿250, Weekly ฿1,200, Monthly ฿4,500-6,500
**Location:** Bangpho, MRT Blue Line, 5-min walk
**Target:** Digital nomads (60%), local remote workers (25%), coffee enthusiasts (15%)
