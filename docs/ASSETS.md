# Assets

> **AI agents — read this file when:** adding images, icons, or public files.

---

## Locations

- Static files: `public/` (favicon, og-image, `data/data.json` when present)
- Map paths: large SVG path strings in `src/constants/states.ts`

---

## Rules

- Next `images.unoptimized: true` — place raster assets in `public/` and reference by path.
- Do not commit huge binary assets without need; prefer compressed formats.
- `public/data/data.json` may be gitignored in some setups — regenerate with `make fetch-index`.
