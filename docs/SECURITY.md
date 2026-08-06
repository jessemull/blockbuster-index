# Security

> **AI agents — read this file when:** handling env vars, proxy/cookies, analytics, chat, or dependencies.

---

## Secrets

- Never commit `.env*`, PEM keys, CloudFront key pairs, or AWS access keys.
- Local proxy signing uses `CLOUDFRONT_*` env vars — see `proxy/util.js` (fails closed: throw on misconfig).
- CI secrets live in GitHub Actions; do not echo them in logs.

---

## Client surface

- Chat requests go to configured HTTPS API endpoints only (`@constants` API_ENDPOINTS).
- Do not persist chat transcripts to `localStorage` without a privacy review.
- Avoid logging full user messages to the console in production paths.

---

## Dependencies

- Run `make security` / `npm audit` when adding deps.
- Prefer well-maintained packages; justify new network/auth/analytics SDKs in the PR.

---

## Sentry & analytics

- Sentry is configured for the Next client — do not scrub in ways that hide real errors, but do not attach secrets to events.
- Google Analytics loads via `layout.tsx` — treat measurement IDs as non-secret but environment-specific.

---

## Static hosting

- Test CDN is cookie-gated; production is public static assets — assume HTML/JS are world-readable. Never embed secrets in the client bundle.
