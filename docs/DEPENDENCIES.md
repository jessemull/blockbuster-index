# Dependencies

> **AI agents — read this file when:** adding, removing, or upgrading npm packages.

---

## Principles

- Prefer packages already in the tree (Next, React, Chart.js, Three, Sentry, Testing Library).
- New runtime dependencies need a clear problem statement in the PR.
- Prefer official / widely used libraries for AWS, charts, and a11y.

---

## Process

1. Check whether an existing dependency already solves the need.
2. Add with an exact or caret range consistent with the repo.
3. Run `make lint`, `make test`, and `make build`.
4. Run `make security` / `npm audit` and note residual risk.
5. Document notable upgrades in the PR body.

---

## Discouraged without product approval

- Additional LLM provider SDKs in this client
- New global state managers (Redux, Zustand, MobX)
- Heavy date/UI kits that duplicate Tailwind + lucide

---

## Automation

Dependabot (`.github/dependabot.yml`) opens weekly npm PRs. Review carefully for breaking Next/ESLint majors.
