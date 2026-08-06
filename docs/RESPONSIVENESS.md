# Responsiveness

> **AI agents — read this file when:** changing layouts or breakpoints.

---

## Breakpoints

Aligned with Tailwind defaults, exposed via `useBreakpoint`:

| Name | Width                   |
| ---- | ----------------------- |
| `sm` | &lt; 768px              |
| `md` | ≥ 768px and &lt; 1024px |
| `lg` | ≥ 1024px                |

`colCount` helper: 1 / 2 / 3 columns for Rankings.

---

## Rules

- Prefer Tailwind responsive prefixes (`md:`, `lg:`) for layout.
- Use `useBreakpoint` when JS must change chart options (e.g. lollipop tick visibility).
- Do not duplicate resize listeners — extend the shared hook.
