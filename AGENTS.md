# AGENTS.md — Blockbuster Index Client

> Complete development rules and constraints for AI agents and human contributors.
> This file is the authoritative reference for coding standards. Precedence: see `CONTEXT.md`.

---

## Repository Overview

| Field                 | Value                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------- |
| **Project**           | Blockbuster Index client                                                                      |
| **Architecture**      | Next.js App Router static site + React context data layer                                     |
| **Platform**          | Web (static hosting)                                                                          |
| **Core Technologies** | Next.js 15, React 19, TypeScript, Tailwind, Chart.js, react-chartjs-2, Three.js / R3F, Sentry |
| **CI/CD**             | GitHub Actions → S3 / CloudFront                                                              |
| **Git Hooks**         | Husky + lint-staged + Conventional Commits (commitlint)                                       |

### Layout

```
blockbuster-index/
├── src/
│   ├── app/                 # Routes: /, /about, /rankings, /signals
│   ├── components/          # UI: BlockbusterIndex, Charts, Rankings, Signals, VHSBot, Shared, …
│   ├── constants/           # api, charts, colors, regions, states, weights, ui
│   ├── hooks/               # useBreakpoint, useScoreScale, useScoreStats
│   ├── providers/           # BlockbusterDataProvider
│   ├── types/
│   └── utils/
├── scripts/                 # fetch-index, connect (bastion), source-maps, preflight
├── proxy/                   # Local CloudFront signed-cookie proxy
├── cloudformation/
├── docs/                    # Governance documentation
├── .cursor/                 # Rules, skills, commands
├── .github/                 # Workflows + PR/issue templates
├── CONTEXT.md
├── AGENTS.md                # This file
└── Makefile
```

### Path aliases

Use these instead of deep relative imports:

| Alias                         | Path               |
| ----------------------------- | ------------------ |
| `@components/*`               | `src/components/*` |
| `@hooks` / `@hooks/*`         | `src/hooks`        |
| `@providers` / `@providers/*` | `src/providers`    |
| `@constants` / `@constants/*` | `src/constants`    |
| `@types` / `@types/*`         | `src/types`        |
| `@utils` / `@utils/*`         | `src/utils`        |
| `@pages/*`                    | `src/app/*`        |

---

## Development Commands

Prefer **`make`** targets (see `make help`). Equivalents use npm.

### Setup

| Command                                    | Description                                 |
| ------------------------------------------ | ------------------------------------------- |
| `npm install`                              | Install dependencies                        |
| `npm run fetch-index` / `make fetch-index` | Pull latest `public/data/data.json` from S3 |
| `npm run prepare`                          | Install Husky hooks                         |

### Quality

| Command           | Description                                        |
| ----------------- | -------------------------------------------------- |
| `make lint`       | ESLint with `--fix` (includes perfectionist sorts) |
| `make format`     | Prettier write                                     |
| `make test`       | Jest with coverage                                 |
| `make build`      | Next.js static export build                        |
| `make preflight`  | lint + test + build                                |
| `make security`   | `npm audit`                                        |
| `make e2e`        | Cypress                                            |
| `make lighthouse` | LHCI                                               |

### Local

| Command                    | Description                      |
| -------------------------- | -------------------------------- |
| `npm run dev` / `make dev` | Next.js dev server               |
| `npm run proxy`            | Signed-cookie proxy for test CDN |
| `npm run bastion`          | SSH to bastion                   |

---

## Language & Framework Rules

### TypeScript

- Keep `strict: true` and `moduleResolution: "bundler"`.
- Prefer explicit types on exported APIs; avoid `any`. Narrow Chart.js assertions when mixed bar/scatter datasets require them.
- Use `USAStateAbbreviation` and typed records for state keys where possible (`Partial<Record<USAStateAbbreviation, …>>`).

### React / Next.js

- Mark client components with `'use client'` only when needed (hooks, browser APIs, Chart.js, Three.js).
- Pages under `src/app/` should stay thin — compose feature components.
- Respect static export: no features that require a Node server at runtime on S3/CloudFront.

### Alphabetization (enforced)

Imports, named import members, object keys (where practical), interface properties, and JSX props (except `key` first, `on*` last) MUST be alphabetized. **Enforced by `eslint-plugin-perfectionist`** and auto-fixed via `make lint` / `npm run lint`.

### Comments

Follow `docs/COMMENTS.md`. Prefer self-documenting names; comments explain **why**. Use nextdoor-style spacing: blank line above/below standalone comments; no blank lines around JSX comments.

---

## Architecture Rules

### Layers

- **Routes** (`src/app`) → **feature components** → **hooks/providers/utils**.
- Chart visualization logic lives under `src/components/Charts/`.
- Shared shells: `src/components/Shared/` (`PageBackground`, `Footer`, `ChevronSelect`).

### Data

- Index scores come from `/data/data.json` via `BlockbusterDataProvider`.
- Do not invent signal keys; use `SIGNAL_KEYS` / `SIGNAL_WEIGHTS` / `SIGNAL_LABELS` from `@constants`.
- Region averages use `CENSUS_DIVISIONS` — see `docs/DATA_CONTRACT.md`.

### State

- App index data: React Context (`BlockbusterDataProvider`) only — no Redux/Zustand unless a product decision adds them.
- Local UI state (`useState`) is fine for selections, chat, breakpoints.

### Chat / LLM boundary

- `VHSBot` is a fetch client to the external chat API (`API_ENDPOINTS` in `@constants`).
- Do not embed model prompts or scoring logic in this repo.

---

## Testing Rules

- Unit/component: Jest + Testing Library; accessibility: jest-axe where established.
- Coverage gate: **80%** (CI and local `npm test`).
- E2E: Cypress smoke (`npm run e2e`).
- Prefer testing user-visible behavior and edge cases over implementation details.
- Do not remove tests solely to raise coverage percentage.

See `docs/TESTING.md`.

---

## Performance Rules

- Lazy-load heavy 3D/chat UI when practical; avoid blocking the main viz.
- Chart.js: register only needed controllers/elements per chart module.
- Watch bundle size (`ENABLE_ANALYZER=true` when investigating).
- Lighthouse regressions on merge can trigger rollback — see `docs/CI_CD.md` / `docs/PERFORMANCE.md`.

---

## Security Rules

- Secrets only in env / CI / local `.env*` (gitignored).
- Never commit CloudFront private keys or AWS keys.
- Do not log chat message contents or PII to third parties beyond existing Sentry/GA configuration without review.

See `docs/SECURITY.md`.

---

## Git & PR Rules

- Conventional Commits via commitlint; prefer `npm run commit` (Commitizen).
- Pre-commit: lint-staged. Commit-msg: commitlint.
- PRs use `.github/PULL_REQUEST_TEMPLATE.md`.
- Review severity tiers: `docs/REVIEW.md` (MUST / SHOULD / NICE).

---

## Forbidden Patterns

- Adding server-only Next features incompatible with `output: 'export'`
- Hardcoded API keys or cookie-signing material
- Duplicating page background/footer/select markup instead of Shared components
- Redefining `VizType` outside `@constants`
- Lowering coverage thresholds or disabling Husky/commitlint to bypass gates
- Importing from sibling MCP/chat repos as local packages without an explicit dependency decision

---

## When stuck

1. Re-read `CONTEXT.md` precedence.
2. Check domain doc (`CHARTS.md`, `DATA_CONTRACT.md`, etc.).
3. Run `make preflight` and fix failures before expanding scope.
4. Flag product/architecture decisions for human review per `docs/GOVERNANCE.md`.
