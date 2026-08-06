# CI / CD

> **AI agents — read this file when:** changing workflows, interpreting CI failures, or documenting deploy gates.

---

## Workflows (existing)

| Workflow                             | Trigger             | Role                                                                                |
| ------------------------------------ | ------------------- | ----------------------------------------------------------------------------------- |
| `.github/workflows/pull-request.yml` | PR → `main`         | Build, lint, unit tests (coverage), Cypress, Lighthouse (LH may continue-on-error)  |
| `.github/workflows/merge.yml`        | Push → `main`       | Build → test → S3 backup → deploy (dev) → E2E → Lighthouse → rollback on LH failure |
| `.github/workflows/deploy.yml`       | `workflow_dispatch` | Manual deploy to test/production                                                    |
| `.github/workflows/rollback.yml`     | `workflow_dispatch` | Restore named S3 backup                                                             |

Do **not** rewrite these lightly. Document changes in the PR and treat as human-review required (`docs/GOVERNANCE.md`).

---

## Local parity

Husky runs `./scripts/preflight.sh` (lint + test + build) on **every `git push`** via `.husky/pre-push`. Agents can also run it manually:

```bash
make preflight   # lint + test + build
```

Optionally `make e2e` / `make lighthouse` when touching UX or performance-sensitive paths. Skip hooks only with explicit user request (`HUSKY=0` or `--no-verify`).

---

## Data in CI

`fetch-index` may skip in CI without AWS credentials (script exits 0). Builds must still succeed with committed or previously fetched `public/data/data.json` when present; respect `.gitignore` rules for generated SEO/data files as documented in README.
