# Theming

> **AI agents — read this file when:** changing colors, typography, or Tailwind usage.

---

## System

- Tailwind CSS 4 with utility-first styling.
- Brand palette in `src/constants/colors.ts` (JS/charts) and mirrored Tailwind `@theme` tokens in `src/app/globals.css` (`brand-yellow`, `brand-dark-blue`, …).
- Prefer `text-brand-yellow` / `bg-brand-dark-blue` utilities (or `COLORS.*` in JS) over raw hex.

---

## Rules

- Prefer Tailwind utilities + shared constants over new CSS modules unless global (`globals.css`).
- Do not introduce a second design-system library without approval.
- Dark nostalgic theme is intentional — avoid light-theme one-offs that break cohesion.
