# Dependencies

> **AI agents — read this file when:** adding, removing, or upgrading npm packages.

---

## Principles

- Prefer packages already in the tree (Next, React, Chart.js, Three, Sentry, Testing Library).
- New runtime dependencies need a clear problem statement in the PR.
- Prefer official / widely used libraries for AWS, charts, and a11y.
- Stay on the latest major/minor that the toolchain supports; document intentional holds below.

---

## Process

1. Check whether an existing dependency already solves the need.
2. Add with an exact or caret range consistent with the repo.
3. Run `make preflight` (lint + typecheck + test + build).
4. Run `make security` / `npm audit` and note residual risk.
5. Document notable upgrades in the PR body.

---

## Runtime

| Surface                         | Version             | Notes                                                                                              |
| ------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| Local / CI Node (`engines`, CI) | **26**              | GitHub Actions `node-version: '26'`; `.nvmrc` = `26`. Current line (LTS Oct 2026). No Lambda here. |
| CloudFront Function runtime     | `cloudfront-js-2.0` | Not Node — do not confuse with Node LTS.                                                           |

Upgrade CI/local Node with the newest even Current/LTS line Actions supports — do **not** stay on an older major because an action once defaulted there.

## Intentional version holds

Only hold when a **peer range or pin** blocks the bump. Update the table when peers move.

| Package               | Held at   | Latest blocked | Why                                                                           |
| --------------------- | --------- | -------------- | ----------------------------------------------------------------------------- |
| `eslint`              | `9.39.x`  | 10.x           | `eslint-plugin-react` / `eslint-plugin-jsx-a11y` peer ranges stop at ESLint 9 |
| `typescript`          | `^6.0.3`  | 7.x            | `typescript-eslint` (via `eslint-config-next`) peers `>=4.8.4 <6.1.0`         |
| `lighthouse` (direct) | `^12.8.2` | 13.x           | `@lhci/cli@0.15` pins `lighthouse@12.6.1`; keep major aligned with LHCI       |

Do **not** run `npm audit fix --force` — it may downgrade `@lhci/cli` to ancient versions.

Residual audit findings are mostly transitive via `@lhci/cli` (e.g. nested `uuid`, high-severity `tmp`). Prefer upgrading LHCI when a compatible release lands; do not force-resolve `@lhci/cli` → `tmp` via `npm audit fix --force`.

---

## GitHub Actions

Pin major tags at the current latest (today: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`, `actions/download-artifact@v8`). Dependabot also watches `github-actions`.

Node 20 deprecation warnings mean the **action** still declares Node 20 while the runner forces 24 — fix by upgrading the action majors, not by pinning CI back to 20.

---

## Discouraged without product approval

- Additional LLM provider SDKs in this client
- New global state managers (Redux, Zustand, MobX)
- Heavy date/UI kits that duplicate Tailwind + lucide

---

## Automation

Dependabot (`.github/dependabot.yml`) opens weekly npm and GitHub Actions PRs. Review carefully for breaking Next/ESLint majors.
