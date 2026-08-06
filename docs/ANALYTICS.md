# Analytics

> **AI agents — read this file when:** changing measurement or GA loading.

---

## Current

Google Analytics loads from `src/app/layout.tsx` via `NEXT_PUBLIC_GA_TRACKING_ID`, deferred with `requestIdleCallback` when available.

---

## Rules

- Keep GA loading non-blocking.
- Do not send PII or chat contents as event payloads.
- New analytics vendors require human review (`docs/GOVERNANCE.md`).
