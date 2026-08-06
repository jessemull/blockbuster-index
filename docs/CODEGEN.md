# Codegen / generated artifacts

> **Status:** No Flutter-style codegen. Limited generated outputs only.

---

## Generated / build outputs

| Artifact                         | How                                         |
| -------------------------------- | ------------------------------------------- |
| `.next/`, `out/`                 | `next build` (gitignored)                   |
| Sitemap / robots under `public/` | `next-sitemap` postbuild (often gitignored) |
| `public/data/data.json`          | `make fetch-index` (may be gitignored)      |
| Coverage                         | `npm test` (gitignored)                     |

---

## Rules

- Do not hand-edit build output directories.
- Do not commit secrets into generated files.
- After changing routes, ensure sitemap generation still runs on build.
