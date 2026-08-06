# Governance

> **Precedence:** CONTEXT.md > **GOVERNANCE.md** > ARCHITECTURE.md > feature docs > inline comments.
>
> **AI agents — read this file when:** making structural decisions, resolving conflicting guidance, determining what requires human review, or changing governance docs.

---

## Source-of-truth precedence

| Rank | Document          | Scope                           |
| ---- | ----------------- | ------------------------------- |
| 1    | `CONTEXT.md`      | Constraints and quality gates   |
| 2    | `GOVERNANCE.md`   | Process and authority           |
| 3    | `ARCHITECTURE.md` | Structure and boundaries        |
| 4    | Domain docs       | Charts, data contract, UI, etc. |
| 5    | Inline comments   | Local intent                    |

Resolve conflicts upward, never downward.

---

## Non-negotiable constraints

- Static export (`output: 'export'`) must keep working.
- TypeScript strict mode; ≥ 80% Jest coverage.
- Conventional Commits + Husky hooks must remain enabled.
- No hardcoded secrets; no LLM SDK in this client without product approval.
- Signal/region constants stay the single source of truth for the index UI.

---

## Decision authority

### Autonomous (no extra human gate beyond normal PR)

- Bug fixes that do not change public data contracts or deploy topology
- Tests and documentation within existing files
- Lint/format/perfectionist fixes
- Internal refactors that preserve APIs and static-export behavior
- Chart styling / copy within existing viz types

### Requires human review

- New routes or major information architecture
- Changes to governance docs (`CONTEXT.md`, `AGENTS.md`, `docs/*`)
- New third-party dependencies (especially auth, analytics, 3D, LLM)
- CI/CD or CloudFormation changes
- Security-sensitive code (proxy cookie signing, env handling)
- Changes to `DATA_CONTRACT` / weights / signal keys
- Removing tests or lowering coverage thresholds
- Adding server-side Next features that conflict with static export

### Requires explicit product decision

- New product surfaces not on `docs/ROADMAP.md`
- Embedding LLM scoring or MCP logic in this client
- Privacy / analytics policy changes
- New third-party data vendors in the UI narrative

---

## Governance doc change process

1. Open a PR with `[governance]` in the title.
2. Explain why, prior guidance, and impact.
3. One human reviewer with write access (two if changing this file).
4. Cascade updates to lower-ranked docs in the same or linked PR.

---

## Review policy

- Use severity tiers in `docs/REVIEW.md` (MUST / SHOULD / NICE).
- MUST items block merge.
- Agents using `.cursor/skills/pr-review` or `repo-review` must follow that output shape.
