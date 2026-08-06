# Networking

> **AI agents — read this file when:** adding fetch calls or API URLs.

---

## Endpoints

| Purpose            | Source                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Index JSON         | `GET /data/data.json` (static asset)                                                     |
| Chat               | `API_ENDPOINTS.CHAT.PRODUCTION` or `.DEVELOPMENT` based on `NEXT_PUBLIC_API_ENVIRONMENT` |
| S3 (build tooling) | `scripts/fetch-index.js` via AWS SDK v3                                                  |

---

## Rules

- Centralize URLs in `@constants`.
- Use `fetch` with explicit error handling (`docs/ERROR_HANDLING.md`).
- Chat history formatting: `formatHistoryForAPI` (last N messages).
- Do not call MCP Lambda directly from the browser unless product explicitly adds a public API.
