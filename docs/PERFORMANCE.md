# Performance

> **AI agents — read this file when:** optimizing render, bundle size, charts, or 3D/chat.

---

## Budgets & signals

- Lighthouse CI runs in PR/merge pipelines; merge workflow can roll back on LH failure.
- Prefer investigating with `@next/bundle-analyzer` (`ENABLE_ANALYZER=true`).

---

## Guidelines

- Keep Chart.js registrations scoped to chart modules.
- Avoid recreating large `options`/`data` objects every render without need (follow existing `useMemo` patterns already in charts).
- `VHSCharacter` / R3F is expensive — keep it gated behind chat open state.
- Prefer CSS/Tailwind over JS animation for simple UI.
- Images: static `public/` assets; no image optimizer.

---

## Forbidden shortcuts

- Disabling Lighthouse gates without human approval
- Shipping unbounded lists without virtualization if added later for large datasets (current US-state scale is fine)
