---
stepsCompleted: ['step-01-preflight', 'step-02-select-framework', 'step-03-scaffold-framework', 'step-04-docs-and-scripts', 'step-05-validate-and-summary']
lastStep: 'step-05-validate-and-summary'
lastSaved: '2026-06-27'
---

# Framework Setup Progress — Kill Team Companion

## Step 1: Preflight

### Stack detection
- `test_stack_type: auto` → detected **frontend** (Vite + vanilla JS; `package.json`, `vite.config.js`; no backend manifests).

### Prerequisites
- ✅ `package.json` exists (name: kill-team-companion, type: module, devDep: vite only).
- ✅ No existing test framework config (no playwright/cypress config, no test runner).
- ✅ Architecture context: Vite vanilla-JS app; rules engine in `src/rules/` (pure ES modules).

### Project context
- Bundler: Vite 6.
- Test target (user constraint): **unit tests only, no UI/E2E, minimal deps.** Pure `src/rules/` layer.
- No auth / API — local single-user companion tool.

### Findings
- Greenfield test setup. No framework installed yet.
- User constraint overrides skill's default E2E (Playwright/Cypress) bias → select a **unit-first** runner (vitest or node:test).

## Step 2: Framework Selection

**Decision: Vitest** (unit-first; not Playwright/Cypress).

Rationale:
- User constraint: no UI/E2E tests, minimal deps → Playwright (skill default for frontend) is overkill and wrong fit.
- Vite-native: reuses existing `vite.config.js` transform pipeline → `src/rules/` ESM imports resolve identically to production. Zero config drift.
- Single devDep. ESM-first, watch mode, fast, familiar `describe/it/expect` API.
- Forward-compatible: can layer `@vitest/coverage-v8` + browser mode later without switching runner.

`config.test_framework` was `auto` (not explicit) → user-stated requirement takes precedence over skill default.

## Step 3: Scaffold (sequential; unit-only adaptation of E2E template)

### Critical testability finding
`src/js/models.js` classes (`Operative`/`Weapon`) are **DOM-coupled** — import `audio.js`/`state.js`, call `confirm()`/`playSound`/`ui.*`. NOT importable in node tests. Additionally:
- `shootResolver.js` calls `defender.applyDamage(...)`, but `models.Operative` defines `applyWounds(...)` — **method-name mismatch**; shootResolver is a parallel impl expecting a duck-typed interface, not the real class.
- `shootResolver` uses `weapon.bs`; `models.Weapon` uses `weapon.ts`.
→ Unit tests use **POJO fixtures** matching the duck-typed contract, never the classes.

### Files created
- `package.json` — devDeps `vitest` + `@vitest/coverage-v8`; scripts `test` / `test:watch` / `test:coverage`.
- `vitest.config.js` — node env, `tests/unit/**/*.test.js`, coverage scoped to `src/rules/`, reuses `@` alias.
- `.nvmrc` → 22.
- `tests/support/fixtures/combat.js` — `makeAttacker/makeDefender/makeWeapon` POJO factories (deterministic `applyDamage`).
- `tests/unit/dice.test.js` — S1 scenarios.
- `tests/unit/shootResolver.test.js` — S2 scenarios + matching cascade.
- `.gitignore` — added `coverage/`.

### New defect found during scaffolding
- **D12**: `evaluateAttackRolls` does not enforce natural-1 auto-fail when `bs ≤ 1` (rules: 1 always fails). Recorded as `it.skip` characterization test.

### Verification (run)
```
npx vitest run  →  PASS (14) FAIL (0) skipped (2)
```
Skipped = D1 (cover-save) + D12 (natural-1) characterization tests — documented rule-divergences, red until fixed.

## Step 4: Docs & Scripts
- `tests/README.md` — setup, run, structure, POJO-fixture convention, characterization-test policy.
- `package.json` scripts already present: `test`, `test:watch`, `test:coverage`.

## Step 5: Validate & Summary

### Validation vs checklist
- ✅ Preflight passed (frontend/Vite, no prior framework).
- ✅ Directory structure: `tests/unit/`, `tests/support/fixtures/`.
- ✅ Config: `vitest.config.js` (node env, scoped include + coverage).
- ✅ Fixtures/factories: `combat.js` POJO factories.
- ✅ Docs + scripts present.
- ✅ Suite executes green: **PASS 14 / FAIL 0 / skipped 2**.

### Completion summary
- **Framework:** Vitest 3 (+ `@vitest/coverage-v8`), node environment. Unit-only; no Playwright/Cypress (user constraint).
- **Artifacts:** `vitest.config.js`, `.nvmrc`, `tests/{unit,support/fixtures}/`, sample `dice.test.js` + `shootResolver.test.js`, `tests/README.md`, package.json scripts, `.gitignore` update.
- **Deps installed:** `npm install` ran (105 packages). Runner works.
- **Findings surfaced:** method-name mismatch (`applyDamage` vs `applyWounds`), `bs` vs `ts` divergence, DOM-coupled classes → POJO-fixture convention; new defect **D12** (natural-1 auto-fail not enforced).
- **Next:** implement S3–S6 scenarios from test-design doc; unblock S4/S5 via `combat.js` helper export / `resolveMelee` refactor; fix D1/D12 then unskip characterization tests.
