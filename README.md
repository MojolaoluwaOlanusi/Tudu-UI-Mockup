# Tudu — UI Mockup

Static UI mockup of the Tudu redesign. **Stale data. No backend.**

## Stack

- Vite + React 18
- Tailwind CSS 3
- Radix UI primitives
- Framer Motion
- Lucide icons
- dnd-kit

## Run

```bash
npm install
npm run dev
# http://localhost:5174
```

## Roadmap

This repo is built by a series of patch files. Each patch is applied with `git apply`.

- Part 1 (this patch) — scaffold
- Part 2 — Landing shell + sticky-glass navbar + mega menus
- Part 3 — Hero + LiveBoardHero
- Part 4 — Logo strip + Problem section
- Part 5 — Bento grid
- Part 6 — How it works (sticky scroll) + Under the hood
- Part 7 — Tier gating + Pricing + Changelog + Social proof + Final CTA + Footer
- Part 8 — App shell (rail + topbar + detail panel)
- Part 9 — Sidebar
- Part 10 — List view
- Part 11 — Board view
- Part 12 — Stats + Analytics
- Part 13 — Settings
- Part 14 — Login + Signup + Pricing page + Command palette + ShortcutHelp
- Part 15 — Docs + API + Webhooks + Tokens + Changelog + Help + Contact + Blog + Privacy + Terms

## Rules the mockup follows

- Dark = greys + tudu green accent. No spotlight. Light mode unchanged.
- Full-bleed app content.
- Every landing animation is a real component.
- Static mockup data in `src/mock/`, no network calls.

## License

Private — do not distribute.
