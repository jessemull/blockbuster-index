# PR Review Framework

> **Precedence:** CONTEXT.md > GOVERNANCE.md > ARCHITECTURE.md > **REVIEW.md**.
>
> **AI agents — read this file when:** reviewing a PR, writing review comments, or deciding merge blockers.

---

## Severity tiers

### MUST (blocking)

- Breaks static export or introduces server-only Next APIs incompatible with hosting
- Security issues (secrets, unsafe cookie handling, XSS sinks)
- Crash bugs / unhandled null on critical paths
- Coverage threshold regressions or deleted tests without replacement
- Architecture violations (LLM/scoring logic in client, wrong layering)
- Type-safety abuse (`any` sprawl without justification)
- Broken data contract (signal keys/weights/regions inconsistent with constants)

### SHOULD (significant)

- Missing tests for behavior changes
- A11y gaps (labels, keyboard, contrast)
- Performance footguns (huge re-renders, unbounded chart work)
- Duplicated Shared UI patterns
- Poor error/empty/loading states

### NICE TO HAVE (non-blocking)

- Naming polish
- Optional refactors of equivalent approaches
- Extra docs polish

---

## PR hygiene

- [ ] Focused change; Conventional Commits
- [ ] Template filled (What / Why / Testing)
- [ ] `make preflight` contemplated / CI green
- [ ] No unrelated drive-by edits

---

## Domain checklists (internal — do not paste wholesale into review output)

### TypeScript / Next

- Strict types respected; client boundaries correct
- No static-export regressions

### Charts / data

- VizType from `@constants`; weights/labels consistent
- Selection → badge → detail charts coherent
- Region averages use `CENSUS_DIVISIONS`

### Accessibility

- Interactive controls labeled; axe tests updated when UI changes

### Security

- No secrets; env usage only; chat errors do not leak stack traces to users unnecessarily

### CI / craftsmanship fail signals

- Files/components ballooning without structure
- Silent `catch` that swallows errors
- Magic numbers for colors/weights instead of constants
- Disabled lint/hooks to “make it pass”

---

## Agent review output

Skills `pr-review` and `repo-review` define the fixed section output shape. Use this file for severity definitions only; do not dump checklist tables into the user-facing review.
