---
name: debugging
description: >-
  Systematic debugging for Next.js client, charts, provider, and VHSBot issues.
---

# Debugging

1. Reproduce with `make dev`
2. Check provider network `/data/data.json`
3. Narrow to chart vs provider vs chat
4. Use browser console + React tree
5. Add a failing test when bug is logic-level
6. Fix minimally; run `make test` / targeted suites
