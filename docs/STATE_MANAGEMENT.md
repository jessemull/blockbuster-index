# State Management

> **AI agents — read this file when:** adding shared state or hooks.

---

## Allowed

- `BlockbusterDataProvider` + `useBlockbusterData` for index JSON and region aggregates
- Feature-local `useState` / `useRef` for selection, chat, UI toggles
- Derived hooks: `useScoreStats`, `useScoreScale`, `useBreakpoint`
- Memoize stable callbacks (`useCallback`) for context values that flow to children

## Forbidden (without governance approval)

- Redux, Zustand, MobX, Recoil, Jotai
- Mutable module-level stores for app data
- Fetching `data.json` ad hoc in every chart (use the provider)

---

## Patterns

- Keep provider value identity stable (`useMemo` on context value).
- Selection state for viz lives in `BlockbusterIndex` (or equivalent parent), not deep in Chart.js.
