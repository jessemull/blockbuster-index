# Update branch from main (Blockbuster Index)

```bash
git fetch origin main
git merge origin/main
# or: git rebase origin/main  (only if user explicitly wants rebase)
make preflight
```

Resolve conflicts respecting architecture and data-contract docs. Do not force-push unless explicitly requested.
