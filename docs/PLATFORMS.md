# Platforms

> **AI agents — read this file when:** assuming runtime capabilities.

---

## Supported

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Static hosting: S3 + CloudFront (and local `next dev` / `next start` for preview)

## Not supported

- Native iOS/Android shells
- Server-side rendering at request time on the production static host
- Node APIs inside client components

Test CDN may require signed cookies via `npm run proxy` for local verification.
