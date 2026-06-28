---
workflowStatus: 'completed'
totalSteps: 5
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
nextStep: ''
lastSaved: '2026-06-27'
inputDocuments:
  - 'docs/rules/merged/merged_kt_lite_rules_zh.md'
  - 'docs/rules/merged/merged_kt_legionaries_zh.md'
  - 'docs/rules/merged/merged_kt_plague_marines_zh.md'
  - 'docs/rules/merged/merged_kt_angels_of_death_zh.md'
  - 'src/rules/shootResolver.js'
  - 'src/rules/{dice,weapons,faction,abilities,ploys,strategy,core,ruleSets,actions,index}.js'
  - 'src/js/combat.js'
  - 'knowledge: risk-governance.md, probability-impact.md, test-levels-framework.md, test-priorities-matrix.md'
---

# Test Design Progress — Kill Team Companion

## Step 1: Detect Mode & Prerequisites

### Mode: **Epic-Level**

**Why:**
- Brownfield JS (Vite) app. No BMad PRD / ADR / sprint-status artifacts.
- Requirement source = `docs/rules/merged/` (KT Lite + 3 faction rule docs) + existing code in `src/rules/`.
- Target scope (user-stated): faction abilities + shooting/melee damage resolution. Bugs found in real use.
- Separate concern noted: no test framework yet; user wants minimal deps, no UI tests, basics first → handled via `bmad-testarch-framework` downstream, not this design pass.

### Prerequisite Inputs (Epic-Level)
- ✅ Epic scope: combat resolution (shooting + melee + faction abilities)
- ✅ Acceptance-criteria source: rules docs + current code behavior
- ✅ Architecture context: `src/rules/` (dice, shootResolver, combat, faction, abilities, weapons, ploys, strategy, core)
- ✅ Test target surface: pure rule functions (no DOM), amenable to lightweight unit tests

## Step 2: Load Context & Knowledge Base

### Config flags (tea/config.yaml)
- `tea_use_playwright_utils: true`, `tea_use_pactjs_utils: false`, `tea_pact_mcp: none`
- `tea_browser_automation: auto`, `test_stack_type: auto`
- **User constraint (overrides):** no UI tests, minimal deps, basics first → Playwright/Pact NOT used in this design pass. Pure unit tests only.

### Stack detection
- Vite + vanilla JS frontend. No test runner present (only `vite` devDep). **Greenfield test setup.**
- Test scope = pure JS rule functions (no DOM). → Unit-level only.

### Existing test coverage
- **None.** No `*.test/spec`, no `tests/`/`__tests__/` dirs. `demo.js` is a manual smoke script, not a test.

### Architecture findings (critical)
Two parallel combat implementations:
1. **`src/rules/` — declarative registry (pure, testable).** `shootResolver.resolveShooting()` (220 LOC) = deterministic step-by-step resolver; accepts `mode:'manual'` + explicit dice arrays. `dice.js` (rollDicePool/evaluateAttackRolls/evaluateDefenseRolls). `weapons.js` (applyWeaponRules/weaponMods). `faction.js`, `abilities.js`, `ploys.js`, `strategy.js`. Consumed only by `demo.js`.
2. **`src/js/combat.js` (3193 LOC, DOM-coupled) — the live UI wizard.** Math.random at 18 sites, mutates `wizardState`/`gameState`/DOM. This is the path "in use" where bugs appear.

### Suspected defects flagged for verification (from code read + rules doc)
| # | Location | Issue |
|---|----------|-------|
| D1 | shootResolver.js:116-122 | Cover reduces DF pool by 1 AND adds normal save. Rules: cover = +1 free normal save, pool NOT reduced. Likely over-reduction. |
| D2 | combat.js:677-683 | Severe reads `retainedCrits` from `wizardState.attackCrit` (stale) for upgrade decision. |
| D3 | combat.js:1186-1190 | Rending decrements `norms` before incrementing `crits` — order-dependent count. |
| D4 | combat.js:1168-1176 | Lethal 5+ crit threshold double-counts 6s / boundary logic. |
| D5 | combat.js:2878-2880 | **Melee Severe NOT implemented** (per-die retained-crit logic missing). |
| D6 | combat.js:3122-3163 | DR (Feel-No-Pain): `hasPloyActive` hardcoded false — dead branch. |
| D7 | combat.js:735-745 / 1668 | Poison token applied AFTER damage — `defenderPoisoned` context timing race. |
| D8 | combat.js:1774 | `autoResolveSecondaryAttack` Severe: no `retainedCrits` context passed. |
| D9 | combat.js:2288-2294 | Brutal `defenseBlockRequiresCrit` — melee context unvalidated. |
| D10 | combat.js:1194 | Punishing fail filter redundant `val!==6`. |
| D11 | combat.js:151-154 / 1694 | Soul Gorge D3 heal & Hot self-damage — untested RNG paths. |

### Canonical rules reference (lite) — test oracle
- Hit: attack die ≥ weapon.bs (BS) retained; natural 6 = crit; 1 = auto-fail.
- Crit threshold base 6; Lethal x+ lowers it; Severe/Rending upgrade a normal→crit under conditions.
- Defense: 3 D6, ≥ sv retained; natural 6 = crit save. Cover = +1 normal save **without rolling** (no pool reduction).
- Matching cascade: crit↔crit (1:1), 2norm→1crit, norm↔norm (1:1), crit→norm (1:1).
- Damage: unmatched normal × normalDamage; unmatched crit × criticalDamage.

## Step 3: Testability & Risk Assessment

### 3.1 Testability Review

**🚨 Testability Concerns (actionable first)**

1. **Dual implementation drift.** Same rules encoded twice: `src/rules/shootResolver.js` (pure) and `src/js/combat.js` (UI). Fixes/bugs apply inconsistently. `combat.js` is the live path but the harder-to-test one.
2. **UI path not unit-testable as-is.** `combat.js` mutates `wizardState`/`gameState`/DOM and uses inline `Math.random` at 18 sites. Pure helpers (`weaponMods`, `effectiveWeapon`, `meleeCritThreshold`, `injectedFactionRules`) are **not exported** → unreachable by tests.
3. **Non-determinism.** Inline RNG prevents exact-outcome assertions in the UI path. `shootResolver` mitigates via `mode:'manual'` + explicit dice arrays (good).
4. **Rule registry is the shared root.** `applyWeaponRules`/`weaponMods` feed both layers; a defect there corrupts both, and a single test layer cannot cross-check the two.

**ASRs (Architecturally Significant Requirements)**
- **[ACTIONABLE]** `src/rules/` must be the single canonical rules engine; `combat.js` should delegate, not re-implement. Tests pin `src/rules/` as the oracle.
- **[ACTIONABLE]** Pure helpers in `combat.js` (`weaponMods`, `effectiveWeapon`, crit-threshold, matching cascade) should be extracted & exported (or moved to `src/rules/`) to become testable.
- **[FYI]** RNG should be injectable/seedable for deterministic tests once UI path is refactored.

**✅ Testability Strengths**
- `shootResolver.resolveShooting` already accepts manual dice → deterministic unit tests possible today, zero refactor.
- `dice.js` (`evaluateAttackRolls`/`evaluateDefenseRolls`/`rollDicePool`) is pure → directly testable.
- `src/rules/` is ES modules, no framework lock-in → any minimal runner (node:test, vitest) works.

### 3.2 Risk Assessment Matrix

| ID | Risk | Cat | P | I | Score | Action |
|----|------|-----|---|---|-------|--------|
| R1 | Dual combat impl diverges; bugs hide in untested UI copy | TECH | 3 | 3 | **9 BLOCK** | Pin `src/rules/` as oracle; regression-suite both layers long-term |
| R2 | Damage math wrong vs rules (cover-save D1, melee-Severe D5, crit-threshold D4) | BUS | 3 | 3 | **9 BLOCK** | Characterization tests vs rules doc oracle |
| R3 | Current branch = "lite rules alignment" refactor with **zero** regression net | OPS | 3 | 2 | **6 MITIGATE** | Lock current(correct) behavior in unit tests before merge |
| R4 | UI path (combat.js) untestable → defects D2–D11 persist undetected | TECH | 3 | 2 | **6 MITIGATE** | Extract/export pure helpers; refactor to delegate |
| R5 | Rule registry defects (Severe/Rending/Piercing/Lethal param parsing) corrupt both layers | DATA | 2 | 3 | **6 MITIGATE** | Unit-test `applyWeaponRules` per-rule |
| R6 | Faction ability bugs: Plague DR dead code D6, poison timing D7, Mark/Tactic injection | BUS | 2 | 2 | 4 MONITOR | Faction-specific scenarios |
| R7 | RNG non-determinism blocks exact assertions in UI path | TECH | 2 | 2 | 4 MONITOR | Seed/inject RNG during refactor |
| R8 | Secondary targeting (Blast/Torrent/Devastating) multi-target errors D8 | BUS | 2 | 2 | 4 MONITOR | Multi-target scenarios |

**Owners / timeline:** R1–R5 → this test-design cycle (now). R6–R8 → follow-up after framework lands.

### 3.3 Highest-Priority Summary
- **Two score-9 blockers (R1, R2):** rules divergence + damage-math correctness. Both addressed by establishing `src/rules/` as the canonical, unit-tested oracle.
- **Score-6 enabler (R3):** the active `feat/lite-rules-alignment` branch has no safety net — locking behavior now is high-leverage.
- **Strategy:** unit-test the pure `src/rules/` layer first (minimal deps, no UI), using `merged_kt_lite_rules_zh.md` as the oracle. Treat `combat.js` defects as findings to fix via refactor-to-delegation, covered later.

## Step 4: Coverage Plan & Execution Strategy

**Test level:** Unit only (user constraint: no UI, minimal deps). No E2E/API/Component in this pass.
**ID scheme:** `COMBAT.{story}-UNIT-{seq}`. Oracle = `merged_kt_lite_rules_zh.md`.

### 4.1 Coverage Matrix

#### Story S1 — Dice evaluation (`src/rules/dice.js`) — testable now
| ID | Scenario | Pri | Risk |
|----|----------|-----|------|
| COMBAT.S1-UNIT-001 | evaluateAttackRolls: die≥bs retained, natural 6=crit, natural 1=auto-fail, misses counted | P0 | R2 |
| COMBAT.S1-UNIT-002 | evaluateDefenseRolls: die≥sv retained, 6=crit save, fails counted | P0 | R2 |
| COMBAT.S1-UNIT-003 | rollDicePool: returns `count` dice, all in [1,6] | P1 | R7 |
| COMBAT.S1-UNIT-004 | edge: bs/sv boundary (e.g. bs=3 → 3 retained, 2 fail), empty pool | P1 | R2 |

#### Story S2 — Shooting resolution (`resolveShooting`, manual mode) — testable now
| ID | Scenario | Pri | Risk | Defect |
|----|----------|-----|------|--------|
| COMBAT.S2-UNIT-101 | apl<1 → `{success:false, reason:'INSUFFICIENT_APL'}`, 0 dmg | P0 | R2 | |
| COMBAT.S2-UNIT-102 | not visible → abort NOT_VISIBLE_OR_OUT_OF_RANGE; concealed in cover → TARGET_CONCEALED_IN_COVER | P0 | R2 | |
| COMBAT.S2-UNIT-103 | apl decremented by 1 on valid shot | P0 | R2 | |
| COMBAT.S2-UNIT-104 | all attacks miss → 0 damage, early return | P0 | R2 | |
| COMBAT.S2-UNIT-105 | matching cascade parametric: crit↔crit, 2norm→crit, norm↔norm, crit→norm (4 cases) | P0 | R1/R2 | |
| COMBAT.S2-UNIT-106 | damage = unmatchedNorm×normalDamage + unmatchedCrit×criticalDamage | P0 | R2 | |
| COMBAT.S2-UNIT-107 | **cover = +1 normal save WITHOUT pool reduction** (rules oracle) | P0 | R2 | **D1** |
| COMBAT.S2-UNIT-108 | crit threshold = 6 (base); 1 auto-fail even if ≥bs=1 | P0 | R2 | |

#### Story S3 — Weapon rules registry (`applyWeaponRules`/`weaponHasRule`/`getWeaponRuleParam`/`parseWeaponRule`) — testable now
| ID | Scenario | Pri | Risk | Defect |
|----|----------|-----|------|--------|
| COMBAT.S3-UNIT-201 | Lethal 5+ → critThreshold 5; 5 AND 6 crit, no double-count | P0 | R5 | **D4** |
| COMBAT.S3-UNIT-202 | Piercing x → defenseDice −x; Piercing Crits only when crit retained | P0 | R5 | |
| COMBAT.S3-UNIT-203 | Severe → upgrade 1 normal→crit iff zero crits retained | P0 | R5 | **D2/D8** |
| COMBAT.S3-UNIT-204 | Rending → upgrade 1 normal→crit iff ≥1 crit retained | P0 | R5 | **D3** |
| COMBAT.S3-UNIT-205 | Punishing → retain 1 fail as normal iff crit retained | P1 | R5 | **D10** |
| COMBAT.S3-UNIT-206 | Brutal → defense success requires crit | P1 | R5 | **D9** |
| COMBAT.S3-UNIT-207 | Accurate/Balanced/Ceaseless/Relentless reroll params parsed | P1 | R5 | |
| COMBAT.S3-UNIT-208 | Hot/Limited/Heavy/Range/Devastating/Blast/Torrent/Quiet params parsed | P2 | R5 | |
| COMBAT.S3-UNIT-209 | Toxic/Stun/Shock/Concussive/Tracking/Saturate params parsed | P2 | R5/R6 | **D7** |
| COMBAT.S3-UNIT-210 | parseWeaponRule: distance-prefixed forms (`1" Devastating 1`, `Blast 2"`) | P1 | R5 | |

#### Story S4 — Faction abilities — PARTIAL (predicates testable; injection blocked)
| ID | Scenario | Pri | Risk | Status |
|----|----------|-----|------|--------|
| COMBAT.S4-UNIT-301 | hasMarkOfChaos / hasChapterTactic predicate truthiness | P1 | R6 | testable (abilities.js) |
| COMBAT.S4-UNIT-302 | FACTION_TRAITS: Plague `disgustinglyResilience` present; Angels doctrines; Legion marks | P1 | R6 | testable (faction.js) |
| COMBAT.S4-UNIT-303 | Khorne→Severe(melee), Tzeentch→Severe(ranged), Aggressive→Rending, Siege→Saturate, Sharpshooter+bolt+stationary→Accurate1+Severe | P0 | R6 | **BLOCKED** — `injectedFactionRules` not exported from combat.js |
| COMBAT.S4-UNIT-304 | factionMechanicsEnabled=false → no injection | P1 | R6 | **BLOCKED** (same) |
| COMBAT.S4-UNIT-305 | Plague DR (Feel-No-Pain) reduces damage; ploy-gated branch | P0 | R6 | **D6** — verify via applyDamage path |

#### Story S5 — Melee resolution — BLOCKED on refactor
| ID | Scenario | Pri | Risk | Status |
|----|----------|-----|------|--------|
| COMBAT.S5-UNIT-401 | strike/parry alternation starts with attacker; "if opponent has none, settle all" | P0 | R2 | **BLOCKED** — no `resolveMelee` in src/rules/; logic only in combat.js |
| COMBAT.S5-UNIT-402 | strike damage normal/crit values | P0 | R2 | BLOCKED |
| COMBAT.S5-UNIT-403 | parry: norm↔norm, crit→norm-or-crit | P0 | R2 | BLOCKED |
| COMBAT.S5-UNIT-404 | **melee Severe per-die retained-crit** | P0 | R2 | **D5** — NOT IMPLEMENTED |

#### Story S6 — Damage & wound states (`core.isInjured` + defender.applyDamage) — testable
| ID | Scenario | Pri | Risk |
|----|----------|-----|------|
| COMBAT.S6-UNIT-501 | isInjured: <max → injured; <half → critically injured (−2 move, −1 hit); ≤0 → crippled | P0 | R2 |
| COMBAT.S6-UNIT-502 | applyDamage reduces wounds by damage (DR-aware) | P0 | R2/R6 |

**Duplicate-coverage guard:** every damage/rule assertion lives at unit level only. No E2E duplicates. `shootResolver` matching test (S2-105) and `applyWeaponRules` Severe test (S3-203) are distinct aspects (pipeline vs rule param) — acceptable.

### 4.2 Execution Strategy
- **Runner:** minimal — `node:test` (zero deps, ships with Node) OR `vitest` (already-aligned with Vite). **Recommendation: vitest** (Vite-native, ESM, watch mode; one devDep). Decision deferred to `bmad-testarch-framework`.
- **PR gate:** full unit suite (target <30s). No nightly/weekly tier needed yet.
- **Path:** `tests/unit/` mirroring `src/rules/`. Fixtures = plain operative/weapon objects.

### 4.3 Resource Estimates (ranges)
- P0 (S1,S2,S3-critical,S6 + blocked S4/S5 design): ~16–28 hours
- P1 (S3-mod, S4 predicates, S1-004): ~10–18 hours
- P2 (S3-208/209): ~4–8 hours
- Refactor unblock (export combat.js helpers / add `resolveMelee`): ~8–16 hours
- **Total to first green suite (P0 pure-layer): ~16–28h.** Full incl. refactor: ~40–70h.

### 4.4 Quality Gates
- P0 unit pass rate = 100% (block PR).
- P1 pass rate ≥ 95%.
- `src/rules/` line coverage ≥ 80%.
- Characterization tests for D1/D4/D5 (known-defect oracles) must be committed **red with `it.skip`/todo** until fixed — documents expected-vs-actual.
- No release while R1/R2 (score 9) open without explicit waiver.
