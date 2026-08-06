## Summary

<!-- What does this PR do? Why? -->

## Type

- [ ] Feature (new functionality)
- [ ] Fix (bug fix)
- [ ] Refactor (code improvement, no behavior change)
- [ ] Test (adding/updating tests)
- [ ] Docs (documentation only)
- [ ] Chore (dependencies, CI, tooling)
- [ ] Governance (`[governance]` title prefix)

## Checklist

### Required

- [ ] `make preflight` passes (lint + test + build) when feasible locally
- [ ] Tests added/updated for behavior changes
- [ ] Coverage remains ≥ 80%
- [ ] No secrets in the client bundle or commits

### Architecture

- [ ] Static export (`output: 'export'`) still valid
- [ ] Layers respected (thin `app/` pages, Shared UI reused)
- [ ] Signal/region/data-contract constants consistent (if touched)

### Quality

- [ ] Loading/error/empty states handled where relevant
- [ ] Accessibility considered (labels, keyboard, axe)
- [ ] Chart/`VizType` changes use `@constants`

### Security

- [ ] No hardcoded secrets
- [ ] Chat/proxy changes reviewed against `docs/SECURITY.md`

## Review Notes

<!-- Focus areas for reviewers -->

## Test Plan

<!-- Commands and manual steps -->
