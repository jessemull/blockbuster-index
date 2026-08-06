# Navigation

> **AI agents — read this file when:** adding routes or nav links.

---

## App Router routes

| Path        | Page                      |
| ----------- | ------------------------- |
| `/`         | Home index visualizations |
| `/about`    | About                     |
| `/rankings` | Rankings tables           |
| `/signals`  | Signals explainer         |

Header nav lives in `src/components/Header`. Use Next.js `Link` for client navigation.

---

## Rules

- Add routes as `src/app/<route>/page.tsx`.
- Keep pages thin; put UI in `src/components/*`.
- Static export emits `.html` paths — avoid APIs that assume a long-running Node server.
- Deep linking / Cognito notes remain in README where applicable.
