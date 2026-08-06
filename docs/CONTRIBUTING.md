# Contributing

> **AI agents — read this file when:** opening PRs, setting up a worktree, or explaining the contributor flow.

---

## Setup

```bash
npm install
make fetch-index   # requires AWS creds / env for S3
make dev
```

Hooks install via `npm prepare` (Husky). Use `npm run commit` for Commitizen prompts.

---

## Branching & commits

- Branch from `main`.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
- Pre-commit runs lint-staged; commit-msg runs commitlint; pre-push runs `./scripts/preflight.sh` (lint + typecheck + test + build).

---

## Pull requests

1. Fill `.github/PULL_REQUEST_TEMPLATE.md`.
2. Pre-push runs preflight; keep it green before opening the PR.
3. Link issues if any.
4. Expect review per `docs/REVIEW.md`.

Governance-only PRs: prefix title with `[governance]`.

---

## Code style

- ESLint + Prettier + perfectionist sort rules (`make lint`).
- Shared UI components for page chrome.
- Tests for behavior changes (`docs/TESTING.md`).

---

## Where to read next

Start at `CONTEXT.md` → `AGENTS.md` → relevant `docs/*`.
