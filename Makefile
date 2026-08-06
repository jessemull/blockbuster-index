# Blockbuster Index client — developer commands.
# Run `make` or `make help` for targets.

.DEFAULT_GOAL := help

.PHONY: help lint lint-fix format test test-coverage e2e lighthouse build preflight security fetch-index dev

help: ## Help@show targets
	@printf 'Blockbuster Index — make <target>\n\n'
	@grep -E '^[a-zA-Z0-9_-]+:.* ## ' Makefile \
		| grep -v '^help:' \
		| awk 'BEGIN {FS = ":.* ## "} \
		{ split($$2, p, "@"); \
		  if (p[1] != g) { if (g != "") print ""; printf "%s\n", p[1]; g = p[1] } \
		  printf "  %-20s %s\n", $$1, p[2] }'

# ── Quality ────────────────────────────────────────────────────────

lint: ## Quality@ESLint with --fix
	npm run lint

lint-fix: lint ## Quality@alias for lint (auto-fix)

format: ## Quality@Prettier write
	npm run format

test: ## Quality@Jest with coverage
	npm test

test-coverage: test ## Quality@alias for test

e2e: ## Quality@Cypress e2e
	npm run e2e

lighthouse: ## Quality@Lighthouse CI
	npm run lighthouse

build: ## Quality@Next.js static export build
	npm run build

preflight: ## Quality@lint + test + build
	./scripts/preflight.sh

security: ## Quality@npm audit
	npm audit --audit-level=high || npm audit

# ── Data / local ───────────────────────────────────────────────────

fetch-index: ## Data@download public/data/data.json from S3
	npm run fetch-index

dev: ## Local@Next.js dev server
	npm run dev
