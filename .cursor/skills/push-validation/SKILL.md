---
name: push-validation
description: >-
  Validate branch before push using preflight and git checks.
---

# Push Validation

```bash
make preflight
git status
```

Ensure hooks would pass; no secrets staged. Do not push unless user asks.
