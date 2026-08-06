# Data Contract

> **AI agents — read this file when:** consuming or displaying index JSON, weights, or regions.

---

## `BlockbusterData`

Defined in `src/types/blockbuster-index.ts`:

```ts
states: Partial<
  Record<
    USAStateAbbreviation,
    {
      score: number;
      components: Record<string, number>; // signal key → 0–100-ish score
    }
  >
>;
```

Loaded from `/data/data.json` by `BlockbusterDataProvider`.

---

## Signals

Keys, labels, and weights live in `src/constants/weights.ts`:

| Key             | Role (UI)           | Weight |
| --------------- | ------------------- | ------ |
| `AMAZON`        | Amazon              | 0.25   |
| `BLS_ECOMMERCE` | BLS E-commerce      | 0.3333 |
| `BROADBAND`     | Broadband           | 0.1667 |
| `WALMART`       | Walmart             | 0.0833 |
| `CENSUS`        | Census              | 0.0833 |
| `BLS_PHYSICAL`  | BLS Physical Retail | 0.0833 |

`SIGNAL_KEYS` is derived from `SIGNAL_WEIGHTS`. Weighted contribution UI: `score × weight` in `Weighted` chart.

**Authoritative computation** of `score` and components is owned by the MCP Lambda sibling — this client displays and re-aggregates for regions only.

---

## Regions

`CENSUS_DIVISIONS` in `src/constants/regions.ts` maps division name → state codes. Provider computes:

- `regionAverages` (sorted)
- `regionAverageByName`
- `regionComponentsAverageByName`
- `getRegionRank`

---

## Compatibility rules

- Do not rename signal keys in the client without coordinating Lambda + docs.
- Treat missing states as absent (`Partial`), not zero, unless product says otherwise.
- Rankings may show per-signal component values or overall `score`.
