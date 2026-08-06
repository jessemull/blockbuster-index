# CI / CD

> **AI agents — read this file when:** changing workflows, interpreting CI failures, or documenting deploy gates.

---

## Workflows

| Workflow                             | Trigger             | Role                                                                                                                                 |
| ------------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `.github/workflows/pull-request.yml` | PR → `main`         | Build, lint, typecheck, unit tests (≥80% coverage), **Preflight** gate, Cypress, Lighthouse (LH `continue-on-error`), advisory audit |
| `.github/workflows/merge.yml`        | Push → `main`       | Same quality gates as PR (incl. lint/typecheck/preflight) → S3 backup → deploy (dev) → E2E → Lighthouse → rollback on LH failure     |
| `.github/workflows/deploy.yml`       | `workflow_dispatch` | Manual deploy to test/production                                                                                                     |
| `.github/workflows/rollback.yml`     | `workflow_dispatch` | Restore named S3 backup                                                                                                              |

Do **not** rewrite these lightly. Document changes in the PR and treat as human-review required (`docs/GOVERNANCE.md`).

### Quality jobs (PR + merge)

| Job        | Blocking?                  | Notes                                                                                                  |
| ---------- | -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Build      | Yes                        | Static export + Sentry source maps                                                                     |
| Lint       | Yes                        | `npm run lint` (perfectionist included)                                                                |
| Typecheck  | Yes                        | `npm run typecheck` (`tsc --noEmit`)                                                                   |
| Test       | Yes                        | Jest + ≥80% statement coverage                                                                         |
| Preflight  | Yes                        | Aggregate gate: requires build + lint + typecheck + test                                               |
| Security   | No                         | `npm audit --audit-level=high` with `continue-on-error: true` (advisory until vuln backlog is cleared) |
| E2E        | Yes                        | Cypress                                                                                                |
| Lighthouse | Soft on PR / hard on merge | PR: `continue-on-error`. Merge: failure triggers S3 rollback                                           |

On merge, **deploy is gated on Preflight** (not on test alone).

---

## Local parity

Husky runs `./scripts/preflight.sh` (lint + typecheck + test + build) on **every `git push`** via `.husky/pre-push`. CI **Preflight** is the same check set as parallel jobs (not a second full script run). Agents can also run:

```bash
make preflight   # lint + typecheck + test + build
make typecheck
make security    # npm audit (will fail while high/critical vulns remain)
```

Optionally `make e2e` / `make lighthouse` when touching UX or performance-sensitive paths. Skip hooks only with explicit user request (`HUSKY=0` or `--no-verify`).

### Branch protection (manual)

Repo settings (not YAML): require PRs into `main`, require status checks **Build**, **Lint**, **Typecheck**, **Run Unit Tests**, **Preflight** (and ideally E2E), and restrict bypass. Not configured by this repo’s workflow files.

---

## Data in CI

`fetch-index` may skip in CI without AWS credentials (script exits 0). Builds must still succeed with committed or previously fetched `public/data/data.json` when present; respect `.gitignore` rules for generated SEO/data files as documented in README.
