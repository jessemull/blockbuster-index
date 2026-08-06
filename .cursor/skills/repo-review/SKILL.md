---
name: repo-review
description: >-
  Full-repo audit for Blockbuster Index using REVIEW.md severity tiers. Use for release readiness or compliance sweeps.
---

# Repository Review

Same severity and bullet format as `pr-review`, but **repo-wide** (not PR-diff-only).

Read full mandatory docs from `CONTEXT.md`. Enumerate `src/`, `scripts/`, `proxy/`, workflows.

## Extra sections

- **Coverage** — Jest threshold posture; obvious gaps
- **Verdict** — Ready / Needs work

Priorities: correctness → architecture → static-export safety → a11y → security → maintainability.
