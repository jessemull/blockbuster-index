# Error Handling

> **AI agents — read this file when:** changing fetch, provider, or chat error paths.

---

## Data provider

`BlockbusterDataProvider` exposes `loading`, `error`, and `data`. UI must handle all three. Prefer user-readable messages; keep technical detail in console/Sentry.

---

## VHSBot

- Non-OK HTTP → parse `ErrorResponse` when possible; show friendly assistant message.
- Network failures → generic recovery message; `console.error` for diagnostics.
- Never throw uncaught through the chat send path.

---

## Charts

- Missing state/region selection → render without badge/detail rather than crashing.
- Guard `Partial` state maps with optional chaining.

---

## Sentry

Use existing `@sentry/nextjs` instrumentation. Do not attach secrets or full chat transcripts to events.
