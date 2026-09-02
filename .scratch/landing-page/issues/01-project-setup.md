# 01 — Project Setup & Scrollcraft Integration

**What to build:** A Next.js 15 project with TypeScript and Tailwind CSS, configured for Cloudflare Pages deployment. The scrollcraft engine (vanilla JS + CSS) is integrated and initializes correctly on page load.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Next.js 15 App Router project with TypeScript + Tailwind CSS
- [ ] Scrollcraft engine files in `public/` (scrollcraft.js, scrollcraft.css)
- [ ] Root layout with Montserrat + Open Sans fonts via Google Fonts
- [ ] Basic page component that initializes scrollcraft engine on mount
- [ ] Cloudflare Pages adapter configured (`@cloudflare/next-on-pages`)
- [ ] `wrangler.toml` for Cloudflare deployment
- [ ] `next.config.ts` optimized for Cloudflare
- [ ] Page loads without errors, scrollcraft engine initializes
- [ ] `npm run build` succeeds
