# Theming

> **AI agents — read this file when:** changing colors, typography, or Tailwind usage.

---

## System

- Tailwind CSS 3 with utility-first styling.
- Brand palette in `src/constants/colors.ts` and chart constants in `src/constants/charts.ts`.

---

## Rules

- Prefer Tailwind utilities + shared constants over new CSS modules unless global (`globals.css`).
- Do not introduce a second design-system library without approval.
- Dark nostalgic theme is intentional — avoid light-theme one-offs that break cohesion.
