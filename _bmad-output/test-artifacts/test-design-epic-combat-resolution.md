# 测试设计文档 — 战斗结算 Epic（射击 / 近战 / 阵营技能）

> Epic-Level 测试设计 · 目标：KT Lite 规则下的伤害结算与阵营能力
> 作者：TEA（Master Test Architect） · 日期：2026-06-27 · 项目：Kill Team Companion
> 规则口径（oracle）：`docs/rules/merged/merged_kt_lite_rules_zh.md`

## 目的

为"战斗伤害结算 + 阵营技能"建立风险驱动、可落地的单元测试设计。用户在使用中已发现问题；当前分支 `feat/lite-rules-alignment` 是规则重构且**无任何回归网**。本设计以最小依赖、不覆盖 UI 为前提，先把纯规则层钉死。

## 执行摘要

- **模式：** Epic-Level（无 BMad PRD/ADR；需求源 = 合并后的规则文档 + 现有代码）。
- **测试层：** 仅 Unit（用户约束：无 UI、最小依赖）。
- **核心结论：** 存在**两套并列的战斗实现**——纯净的 `src/rules/`（可测）与 DOM 耦合的 `src/js/combat.js`（3193 行，bug 所在地）。两条 score-9 阻塞风险（规则分歧、伤害算式错误）均可通过"以 `src/rules/` 为唯一权威 oracle 并加单元测试"来缓解。
- **首条绿线目标：** P0 纯规则层单元套件，约 16–28 小时。

## 范围

**在范围内**
- `src/rules/`：dice、weapons（规则注册表）、faction、abilities、ploys、core、shootResolver。
- 射击结算全链路、武器规则修饰、阵营被动注入、伤害/耐伤状态。
- 已发现缺陷（D1–D11）的特征化测试（characterization）。

**不在范围内（本轮）**
- UI/E2E 测试（用户明确排除）。
- `src/js/combat.js` 内部逻辑的直接单测——其纯函数未被导出，需先重构（见 R4，列为后续）。
- 计谋（ploys）的完整覆盖（仅测与伤害相关的开关，如 DR、教条）。

## 架构与可测性

**关键事实：** 同一套规则被实现两次。
1. `src/rules/shootResolver.js` — 纯函数 `resolveShooting()`，支持 `mode:'manual'` + 显式骰数组，**可确定性单测，零重构**。
2. `src/js/combat.js` — 实际 UI 向导；18 处内联 `Math.random`，直接修改 `wizardState/gameState/DOM`；`weaponMods/effectiveWeapon/meleeCritThreshold/injectedFactionRules` **未导出**，当前不可单测。

**可测性结论**
- 🚨 `combat.js` 不可单元测试 → 其缺陷（D2–D11）持续隐藏。缓解：重构为委托给 `src/rules/`。
- ✅ `src/rules/` 全部为 ES module 纯函数 → 任意极简 runner（`node:test` 或 `vitest`）即可。
- ASR（可执行）：`src/rules/` 必须是唯一权威规则引擎；`combat.js` 应委托而非重写。

## 风险评估矩阵

> 概率/影响 1–3，得分 = P×I（1–9）。≥6 需缓解，=9 阻塞。

| ID | 风险 | 类别 | P | I | 得分 | 动作 |
|----|------|------|---|---|------|------|
| R1 | 双实现分歧；未测的 UI 副本藏 bug | TECH | 3 | 3 | **9 阻塞** | 以 `src/rules/` 为 oracle，长期双层回归 |
| R2 | 伤害算式违背规则（掩体 D1、近战 Severe D5、暴击阈值 D4） | BUS | 3 | 3 | **9 阻塞** | 对照规则文档做特征化测试 |
| R3 | 当前分支=Lite 规则重构，零回归网 | OPS | 3 | 2 | **6 缓解** | 合并前用单测锁定当前正确行为 |
| R4 | UI 路径不可测，D2–D11 持续潜伏 | TECH | 3 | 2 | **6 缓解** | 抽取/导出纯函数，重构委托 |
| R5 | 规则注册表缺陷（Severe/Rending/Piercing/Lethal 解析）污染双层 | DATA | 2 | 3 | **6 缓解** | 逐规则单测 `applyWeaponRules` |
| R6 | 阵营能力 bug：瘟疫 DR 死代码 D6、毒素时序 D7、印记/战术注入 | BUS | 2 | 2 | 4 监控 | 阵营专项场景 |
| R7 | 内联 RNG 不可确定性断言 | TECH | 2 | 2 | 4 监控 | 重构时注入/种子化 RNG |
| R8 | 次要目标（Blast/Torrent/Devastating）多目标错误 D8 | BUS | 2 | 2 | 4 监控 | 多目标场景 |

**责任/时间：** R1–R5 → 本测试周期（现在）。R6–R8 → 框架落地后跟进。
**残留风险：** 在 `combat.js` 重构完成前，UI 路径缺陷仅以"发现清单"形式记录，未被自动测试覆盖——需显式豁免。

## 已发现缺陷清单（特征化测试目标）

| # | 位置 | 问题 | 关联测试 |
|---|------|------|----------|
| D1 | shootResolver.js:116-122 | 掩体把 DF 池 −1 且 +1 普通防守；规则：+1 免费普通防守，池不减 | S2-UNIT-107 |
| D2 | combat.js:677-683 | Severe 读 `wizardState.attackCrit`（陈旧）判升级 | S3-UNIT-203 |
| D3 | combat.js:1186-1190 | Rending 先减 `norms` 后加 `crits`，顺序相关 | S3-UNIT-204 |
| D4 | combat.js:1168-1176 | Lethal 5+ 暴击阈值对 6 重复计数/边界错误 | S3-UNIT-201 |
| D5 | combat.js:2878-2880 | **近战 Severe 未实现**（逐骰保留暴击缺失） | S5-UNIT-404 |
| D6 | combat.js:3122-3163 | DR（不屈）：`hasPloyActive` 硬编码 false，死分支 | S4-UNIT-305 |
| D7 | combat.js:735-745/1668 | 毒素在伤害后施加，`defenderPoisoned` 时序竞态 | S3-UNIT-209 |
| D8 | combat.js:1774 | 次要目标 Severe 未传 `retainedCrits` 上下文 | S3-UNIT-203 |
| D9 | combat.js:2288-2294 | Brutal `defenseBlockRequiresCrit` 近战上下文未校验 | S3-UNIT-206 |
| D10 | combat.js:1194 | Punishing 失败过滤 `val!==6` 冗余 | S3-UNIT-205 |
| D11 | combat.js:151-154/1694 | Soul Gorge D3 治疗 & 过热自伤：未测 RNG 路径 | S3-UNIT-208 |
| D12 | dice.js:28-44 / shootResolver.js:88-92 | 自然 1 未强制失败：bs≤1 时 `evaluateAttackRolls` 把 1 计为普通命中，违背"1 总失败"。dice 层 + 射击集成层各一条红测 | S1-UNIT-001 / S2-UNIT-108 |

## 测试覆盖矩阵

> P0/P1/P2/P3 = 优先级/风险，**非执行时机**。所有场景均为 Unit 层，无跨层重复。

### S1 骰子评估（`dice.js`）— 现可测
| 测试 ID | 场景 | 优先级 | 风险 |
|---------|------|--------|------|
| COMBAT.S1-UNIT-001 | evaluateAttackRolls：≥bs 保留、自然6=暴击、自然1=自动失败、miss 计数 | P0 | R2 |
| COMBAT.S1-UNIT-002 | evaluateDefenseRolls：≥sv 保留、6=暴击防守、fail 计数 | P0 | R2 |
| COMBAT.S1-UNIT-003 | rollDicePool：返回 count 枚、值域 [1,6] | P1 | R7 |
| COMBAT.S1-UNIT-004 | 边界：bs/sv 临界、空池 | P1 | R2 |

### S2 射击结算（`resolveShooting` manual 模式）— 现可测
| 测试 ID | 场景 | 优先级 | 风险 | 缺陷 |
|---------|------|--------|------|------|
| COMBAT.S2-UNIT-101 | apl<1 → INSUFFICIENT_APL，0 伤害 | P0 | R2 | |
| COMBAT.S2-UNIT-102 | 不可见→中止；重掩体隐蔽→TARGET_CONCEALED_IN_COVER | P0 | R2 | |
| COMBAT.S2-UNIT-103 | 合法射击后 apl −1 | P0 | R2 | |
| COMBAT.S2-UNIT-104 | 全未命中→0 伤害早退 | P0 | R2 | |
| COMBAT.S2-UNIT-105 | 对消级联参数化：暴击↔暴击、2普通→暴击、普通↔普通、暴击→普通 | P0 | R1/R2 | |
| COMBAT.S2-UNIT-106 | 伤害 = 未抵消普通×普通伤害 + 未抵消暴击×暴击伤害 | P0 | R2 | |
| COMBAT.S2-UNIT-107 | **掩体 = +1 普通防守且不减池**（规则 oracle） | P0 | R2 | **D1** |
| COMBAT.S2-UNIT-108 | 暴击阈值=6；自然1 即使 ≥bs 也失败 | P0 | R2 | |

### S3 武器规则注册表（`applyWeaponRules` 等）— 现可测
| 测试 ID | 场景 | 优先级 | 风险 | 缺陷 |
|---------|------|--------|------|------|
| COMBAT.S3-UNIT-201 | Lethal 5+→阈值5；5 与 6 均暴击、不重复计 | P0 | R5 | **D4** |
| COMBAT.S3-UNIT-202 | Piercing x→防御骰 −x；Piercing Crits 仅在有暴击时 | P0 | R5 | |
| COMBAT.S3-UNIT-203 | Severe→无暴击时升 1 普通为暴击 | P0 | R5 | **D2/D8** |
| COMBAT.S3-UNIT-204 | Rending→有暴击时升 1 普通为暴击 | P0 | R5 | **D3** |
| COMBAT.S3-UNIT-205 | Punishing→有暴击时保留 1 失败为普通 | P1 | R5 | **D10** |
| COMBAT.S3-UNIT-206 | Brutal→防守须用暴击 | P1 | R5 | **D9** |
| COMBAT.S3-UNIT-207 | Accurate/Balanced/Ceaseless/Relentless 重掷参数 | P1 | R5 | |
| COMBAT.S3-UNIT-208 | Hot/Limited/Heavy/Range/Devastating/Blast/Torrent/Quiet 参数 | P2 | R5 | **D11** |
| COMBAT.S3-UNIT-209 | Toxic/Stun/Shock/Concussive/Tracking/Saturate 参数 | P2 | R5/R6 | **D7** |
| COMBAT.S3-UNIT-210 | parseWeaponRule：距离前缀形态（`1" Devastating 1`、`Blast 2"`） | P1 | R5 | |

### S4 阵营能力 — 部分（谓词可测；注入受阻）
| 测试 ID | 场景 | 优先级 | 风险 | 状态 |
|---------|------|--------|------|------|
| COMBAT.S4-UNIT-301 | hasMarkOfChaos / hasChapterTactic 谓词真假 | P1 | R6 | 可测 |
| COMBAT.S4-UNIT-302 | FACTION_TRAITS：瘟疫 DR、天使教条、军团印记齐备 | P1 | R6 | 可测 |
| COMBAT.S4-UNIT-303 | Khorne→Severe(近战)、Tzeentch→Severe(远程)、Aggressive→Rending、Siege→Saturate、Sharpshooter+bolt+未动→Accurate1+Severe | P0 | R6 | **受阻**（注入未导出） |
| COMBAT.S4-UNIT-304 | factionMechanicsEnabled=false→不注入 | P1 | R6 | **受阻** |
| COMBAT.S4-UNIT-305 | 瘟疫 DR 减伤；ploy 门控分支 | P0 | R6 | **D6** |

### S5 近战结算 — 重构前受阻
| 测试 ID | 场景 | 优先级 | 风险 | 状态 |
|---------|------|--------|------|------|
| COMBAT.S5-UNIT-401 | 出击/格挡交替、攻方先手、对手无剩余则全结算 | P0 | R2 | **受阻**（无 resolveMelee） |
| COMBAT.S5-UNIT-402 | 出击伤害 普通/暴击 取值 | P0 | R2 | 受阻 |
| COMBAT.S5-UNIT-403 | 格挡：普通↔普通、暴击→普通或暴击 | P0 | R2 | 受阻 |
| COMBAT.S5-UNIT-404 | **近战 Severe 逐骰保留暴击** | P0 | R2 | **D5 未实现** |

### S6 伤害与耐伤状态（`core.isInjured` + applyDamage）— 可测
| 测试 ID | 场景 | 优先级 | 风险 |
|---------|------|--------|------|
| COMBAT.S6-UNIT-501 | isInjured：<最大→受伤；<半→受创(−2 移动、−1 命中)；≤0→残废移除 | P0 | R2 |
| COMBAT.S6-UNIT-502 | applyDamage 按 damage 扣减（DR 感知） | P0 | R2/R6 |

**去重校验：** 所有伤害/规则断言仅存于 Unit 层。S2-105（管线对消）与 S3-203（Severe 参数）属不同侧面，不构成重复。

## 执行策略

- **Runner（建议）：** `vitest`（Vite 原生、ESM、watch；单一 devDep）。或零依赖的 `node:test`。最终由 `bmad-testarch-framework` 定。
- **PR 门：** 全部单元测试（目标 <30s）。当前规模无需 nightly/weekly 层。
- **目录：** `tests/unit/` 镜像 `src/rules/`；fixture 为纯 operative/weapon 对象。

## 资源估算（区间）

| 项 | 估算 |
|----|------|
| P0（S1/S2/S3 关键/S6 + 受阻 S4/S5 设计） | ~16–28 小时 |
| P1（S3 中段、S4 谓词、S1-004） | ~10–18 小时 |
| P2（S3-208/209） | ~4–8 小时 |
| 解阻重构（导出 combat.js 助手 / 新增 `resolveMelee`） | ~8–16 小时 |
| **首条绿线（P0 纯规则层）** | **~16–28 小时** |
| **含重构全量** | **~40–70 小时** |

## 质量门

- P0 单测通过率 = 100%（阻塞 PR）。
- P1 通过率 ≥ 95%。
- `src/rules/` 行覆盖率 ≥ 80%。
- **规则为准：** 用例一律以规则文档为 oracle；代码与规则不符则用例 **FAIL（真实红）** 并登记缺陷（D1/D12…）。当前已知红测：D1（掩体减池）、D12（自然1未失败，dice 层 + 射击集成层）。修复代码后自然转绿。
- R1/R2（score 9）未关闭前不得发布，除非显式豁免。

## 假设与依赖

- 假设：`merged_kt_lite_rules_zh.md` 为权威规则；`src/rules/` 当前行为即"期望"（用于特征化），违规则处例外（D1 等）。
- 依赖：测试框架由 `bmad-testarch-framework` 选定；近战/阵营注入的可测性依赖后续导出重构（R4）。

## 进入/退出准则

- **进入：** Node 工具链就绪；runner 选定；规则文档可访问。
- **退出：** P0 全绿；`src/rules/` 覆盖率达标；已知缺陷或修复或以特征化测试记录。

## 后续工作流

1. `bmad-testarch-framework` — 选定并搭建最小 runner（先于写测试）。
2. `bmad-testarch-atdd` — 用 P0 场景生成红相位验收骨架。
3. （可选）`bmad-testarch-automate` — 扩展覆盖率；`bmad-testarch-trace` — 建立需求-测试追溯。

## 交付物索引

- 本文档：`_bmad-output/test-artifacts/test-design-epic-combat-resolution.md`
- 过程记录：`_bmad-output/test-artifacts/test-design-progress.md`
