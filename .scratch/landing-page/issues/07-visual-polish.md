# 07 — Scrollcraft Visual Polish

**What to build:** Fine-tune the scroll experience with kinetic text, parallax effects, and visual polish. The page feels premium and engaging at every scroll position.

**Blocked by:** 04 (Worldflight Structure)

**Status:** ready-for-agent

- [ ] Hero headline uses `data-sc-kinetic="lines"` for line-by-line reveal
- [ ] Problem section uses `data-sc-cue` with proper enter/hold/leave windows
- [ ] Solution section reveal feels like a "turn" moment
- [ ] CTA section uses `data-sc-spotlight` for interactive light effect
- [ ] All copy blocks have appropriate `data-sc-cue` timing
- [ ] No dead scroll positions (every scroll position changes something)
- [ ] Cues never stuck at partial opacity
- [ ] Grain overlay visible for depth (`.sc-grain`)
- [ ] Progress bar at top of page (`data-sc-progress`)
- [ ] Scroll feels smooth, not jerky
- [ ] Mobile scroll experience is smooth
- [ ] Reduced motion fallback works (no position changes, opacity still reveals)
