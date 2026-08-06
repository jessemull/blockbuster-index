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

## Intentional version holds

| Package               | Held at   | Latest blocked                  | Why                                                                                                  |
| --------------------- | --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `eslint`              | `^9.39.5` | 10.x                            | `eslint-config-next` / `eslint-plugin-jsx-a11y` / `eslint-plugin-react` peer ranges stop at ESLint 9 |
| `typescript`          | `^5.9.3`  | 7.x                             | `typescript-eslint` (via `eslint-config-next`) peers `>=4.8.4 <6.1.0`                                |
| `lighthouse` (direct) | `^12.8.2` | 13.x (when published as latest) | `@lhci/cli@0.15` pins `lighthouse@12.6.1`; keep major aligned with LHCI                              |

Do **not** run `npm audit fix --force` — it may downgrade `@lhci/cli` to ancient versions.

Residual audit findings are mostly transitive via `@lhci/cli` (e.g. nested `uuid`). Prefer upgrading LHCI when a compatible release lands.

---

## Discouraged without product approval

- Additional LLM provider SDKs in this client
- New global state managers (Redux, Zustand, MobX)
- Heavy date/UI kits that duplicate Tailwind + lucide

---

## Automation

Dependabot (`.github/dependabot.yml`) opens weekly npm PRs. Review carefully for breaking Next/ESLint majors.
