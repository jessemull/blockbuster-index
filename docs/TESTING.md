# Testing

> **AI agents — read this file when:** adding tests, changing coverage, or choosing what to test.

---

## Goals

Tests build **confidence** and catch regressions. Prefer behavior over implementation details.

---

## Stack

| Layer            | Tool                                |
| ---------------- | ----------------------------------- |
| Unit / component | Jest + Testing Library              |
| A11y             | jest-axe (established patterns)     |
| E2E              | Cypress (`cypress/e2e/smoke.cy.js`) |
| Perf smoke       | Lighthouse CI                       |

Coverage: **`npm test`** (Jest `--coverage`) must meet **≥ 80%** as enforced in CI.

---

## What to test

- Provider loading / error / region aggregate behavior
- Viz selection and selection → detail chart wiring (with mocks for Chart.js as needed)
- Rankings sorting/filtering by signal
- Shared components (ChevronSelect, Footer year, etc.)
- Utils (`chunkColumns`, `formatHistoryForAPI`, `scrollIntoView`)
- VHSBot send/error/env endpoint selection (mock `fetch`)

## What not to overtest

- Chart.js internals / canvas pixels
- Three.js scene graph details (prefer shallow scene mocks)
- Pure Tailwind class strings unless they encode behavior
- Third-party library behavior

---

## Conventions

- Colocate `*.test.tsx` / `*.test.ts` next to sources (existing pattern).
- Mock `chart.js` / `react-chartjs-2` at the suite level when inspecting props.
- Polyfills (e.g. `crypto.randomUUID`) belong in `jest.setup.ts`.
- Prefer `userEvent` / `fireEvent` for interactions; assert accessible names where possible.

---

## Commands

```bash
make test          # or npm test
npm run test:watch
npm run e2e
```

Do not lower coverage thresholds or delete tests only to pass CI.
