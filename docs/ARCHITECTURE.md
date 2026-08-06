# Architecture

> **Precedence:** CONTEXT.md > GOVERNANCE.md > **ARCHITECTURE.md** > feature docs.
>
> **AI agents — read this file when:** adding modules, changing data flow, or placing new files.

---

## System shape

This repository is the **visualization client** for the Blockbuster Index.

```
MCP Lambda (sibling) ──writes──► S3 data/data.json
                                      │
                          fetch-index / CI / build
                                      ▼
                           public/data/data.json
                                      │
                         BlockbusterDataProvider
                                      ▼
                    Pages → Charts / Rankings / Signals
                                      │
                         VHSBot ──HTTP──► Chat API (sibling)
```

Static HTML/JS/CSS is exported by Next.js and hosted on **S3 + CloudFront**.

---

## Folder responsibilities

| Path                                       | Responsibility                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| `src/app/`                                 | Route entrypoints and root layout (metadata, GA, provider, VHSBot shell) |
| `src/components/BlockbusterIndex/`         | Home viz orchestration (selector, router, selection state)               |
| `src/components/Charts/`                   | Heat maps, lollipop, regional bars, selection charts, widgets            |
| `src/components/Shared/`                   | PageBackground, Footer, ChevronSelect                                    |
| `src/components/VHSBot/` + `VHSCharacter/` | Chat UI + 3D Tapey                                                       |
| `src/providers/`                           | Index JSON fetch + region aggregates                                     |
| `src/constants/`                           | Weights, labels, regions, viz options, colors, API URLs                  |
| `src/hooks/`                               | Score stats/scale, breakpoints                                           |
| `scripts/`                                 | S3 fetch, bastion, source maps, preflight                                |
| `proxy/`                                   | Local signed-cookie CDN proxy                                            |

---

## Dependency direction

```
app routes → feature components → hooks / providers / utils / constants / types
```

- Feature components may import Shared, Charts widgets, constants, hooks, providers.
- Providers must not import heavy page UI.
- Constants must not import React components.

---

## Client vs static constraints

- Prefer `'use client'` only where hooks, Chart.js, Three.js, or browser APIs require it.
- Do not introduce Route Handlers or server actions that the static host cannot run.
- Images remain unoptimized for export compatibility.

---

## Visualization architecture

1. User picks a `VizType` (`map` | `lolli` | `regional` | `hist`) from `@constants`.
2. `VisualizationRouter` mounts the matching chart.
3. Selection updates parent state → Badge + `SelectedStateCharts` / `SelectedRegionCharts`.
4. Detail charts share `Radar` / `Bars` / `Weighted` against signal components.

See `docs/CHARTS.md` and `docs/DATA_CONTRACT.md`.

---

## Fail signals

- Business/scoring logic duplicated in the client that belongs in MCP Lambda
- New global state libraries without governance approval
- Copy-pasted page chrome instead of Shared components
- Circular imports between Charts and providers
