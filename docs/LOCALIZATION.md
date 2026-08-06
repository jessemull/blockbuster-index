# Localization

> **Status:** English-only UI copy.

---

## Rules today

- User-facing strings may live inline in components (existing pattern).
- Prefer consistent terminology: “Blockbuster Index”, signal names from `SIGNAL_LABELS`.

## If adding i18n later

- Choose a library compatible with static export.
- Externalize strings; do not interpolate raw HTML from translations.
- Update this doc and `AGENTS.md` in the same change.
