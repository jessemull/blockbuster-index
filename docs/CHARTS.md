# Charts

> **AI agents — read this file when:** changing visualizations or Chart.js usage.

---

## Viz types

From `src/constants/ui.ts` (`VIZ_OPTIONS` / `VizType`):

| Value      | Component               |
| ---------- | ----------------------- |
| `map`      | `NationalHeatMap`       |
| `lolli`    | `NationalLollipopChart` |
| `regional` | `RegionalHeatMap`       |
| `hist`     | `RegionalBarChart`      |

Import `VizType` only from `@constants` — do not redefine locally.

---

## Selection UX

1. User selects state or region on the active viz.
2. Badge shows score + rank (`Badge` widget).
3. Detail row: `SelectedStateCharts` or `SelectedRegionCharts` → `Radar`, `Bars`, `Weighted`.

Color scale: `useScoreScale` (light blue → dark navy buckets). Documented in the hook.

---

## Chart.js

- Register elements in the module that needs them.
- Prefer typed callbacks (`TooltipItem`, `ChartEvent`, `ActiveElement`).
- Mixed bar/scatter (lollipop) may need a narrow `ChartData<'bar'>` assertion — keep it localized.

---

## Maps

`USAMap` + `StatePaths` for SVG. National vs regional views differ in fill logic (state score vs region average highlight).
