# Accessibility

> **AI agents — read this file when:** changing interactive UI, charts, or maps.

---

## Baseline

- ESLint `jsx-a11y` recommended rules.
- jest-axe used in established component tests — extend when adding major UI.
- Provide `aria-label` / visible `<label htmlFor>` for custom selects and icon buttons (see VizSelector, VHSBot, Rankings).

---

## Charts & maps

- Selection should be available via clear click targets; do not rely on color alone for state meaning (Badge + text ranks).
- Keyboard: native `<select>` and `<button>` preferred over div click handlers when possible.

---

## Checklist for UI PRs

- [ ] Controls have accessible names
- [ ] Focus order is sensible in chat and nav
- [ ] Contrast remains acceptable on yellow/blue theme
- [ ] axe tests updated or justified N/A
