# Lite 规则 vs 代码 — 差异审计与修复计划

> 权威文档：`docs/rules/merged/merged_kt_lite_rules_zh.md`
> 范围：仅 Lite 规则（见 memory `rules-scope-lite-only`）。初版审计 2026-06-20，修复持续更新至 2026-06-21（第 1-3 层 + 核心规则差异 + weapons.js 迁移均已完成）。
> 本文档是**活的记录**：完成项打 ✅，新增发现追加到对应分层。

---

## 背景

逐条比对 Lite 文档与代码后，差异归为 4 类。前两类是必须处理的真问题，后两类是设计取舍/后续功能。

---

## 第 1 层 — 真 Bug（让 Lite 默认对局打错）

### 1A. 阵营机制绕过版本开关（4 处门控遗漏）

这 4 处阵营机制经 `hasFactionTrait()` / 武器规则直接生效，**没有**走 `activeRuleSet().factionMechanicsEnabled`，导致 Lite 默认对局（SM vs PM）违反核心简化规则。

| # | 机制 | 文档要求 | 代码位置 | 状态 |
|---|---|---|---|---|
| 1A-1 | Disgustingly Resilience (DR 4+) | Lite 文档**无此规则** | `src/js/models.js:262` | ✅ 已修 |
| 1A-2 | Astartes 双重行动（同激活 2 射击/近战） | Lite：同一行动不超 1 次（文档 L61） | `src/js/ui.js:1676` | ✅ 已修 |
| 1A-3 | PM 无视命令反击（隐匿特工也能反击） | Lite：只有交战命令的特工能反应（文档 L73） | `src/js/state.js:226` | ✅ 已修 |
| 1A-4 | Toxic（目标带毒素标记 +1 伤害） | Lite 武器规则章**未列** | `src/js/combat.js:670-678`、`:1066-1073` | ✅ 已修 |

**修复方式**：每处加 `activeRuleSet().factionMechanicsEnabled &&` 前置门控，保持 standard 行为不变，Lite 下关闭。

### 1B. Severe 武器规则的错误实现（✅ 已修）

文档（L241）：Severe = 无暴击保留时，将 1 个普通成功替换为关键成功；Devastating/Piercing Crits 仍生效，Punishing/Rending 不生效。

已修复：
- 射击保留阶段"无暴击→升级 1 普通"的正确实现保留。
- 删除了射击伤害阶段与近战中两段错误逻辑（曾把 Severe 当成"保留暴击→普通伤害升级为暴击伤害"，doc 无此机制）。
- 阶段 4b 后，阵营派生 Severe 经 `effectiveWeapon` 注入，由 step6 `weaponMods(...).upgradeNormalToCrit (source==='Severe')` 真正生效（此前因本条移除错误块而失效，现已修复）。

> 备注：近战暂无等价的"保留阶段 Severe 升级"实现（近战按 die 逐个 strike/parry 结算，无聚合保留阶段）。属已知小缺口，后续可经 `effectiveWeapon` 统一补全。

### 1C. Heavy 武器规则（✅ 已修）

文档（L219）：Heavy = 进行过移动的激活不能用 + 用过不能再移动；`Heavy(仅限冲刺)` 表示只允许冲刺这一种移动。

实际数据中仅有 `Heavy (Dash only)` 变体（Bolt Sniper Rifle、Reaper Chaincannon），无普通 `Heavy`。故按 "Dash only" 语义实现：**未移动或仅 Dash 时可用；执行过非 Dash 移动（转移/冲锋/后撤/前进）后不可用。**

改动：
- `combat.js` weapon picker（step 2）：`heavyBlocked = isHeavy && attackerNonDashMove`（原为 `isHeavy && !hasDashed`，逻辑相反）。提示文案改为 "[已移动·不可用]"，hint 说明重武器规则。
- `ui.js`：`shootHeavyBlocked` 改为 `allRangedHeavy && nonDashMovePerformed`（仅当所有远程武器都因此不可用才禁 Shoot 按钮）；移除多余的 `hasHeavyWeapon`。
- `actions.js`：Heavy 块同步为 `allRangedHeavy && nonDashMove`，作为 action 级粗筛。
- `constants.js`：更新 Dash 帮助文案（Dash 不再阻止射击/近战，且不再是开火 Heavy 的唯一方式）。

**已知遗留（低优先）**：文档第二条款"用过 Heavy 后不能（非 Dash）移动"未强制（matrix 允许 Shoot 后移动）。由于每次激活仅一次移动，实际影响很小。

---

## 第 2 层 — 架构债：weapons.js 死代码（✅ 已完成迁移）

**决策：A — 迁回注册表。** 分阶段执行。combat.js 各结算阶段调用 `weaponMods(weapon, ctx)`（包装 `applyWeaponRules`）取 mods，按阶段读字段应用；注册表成为规则检测/参数解析/基础效果的单一来源，combat.js 仍是阶段编排者。

**进度**：
- ✅ **阶段 1（基础）**：weapons.js 补注册 PSYCHIC / Poison / Toxic / Indirect Fire 4 条规则 + 扩展 ctx（defenderPoisoned）；combat.js import + `weaponMods()` helper。
- ✅ **阶段 2（纯计算规则迁移）**：
  - 2a 攻击保留：Lethal（critThreshold）、Rending/Punishing（retainMods）、Accurate（autoRetainNormal，**修复多实例合并**）。
  - 2b 防御：Saturate（coverSavesDisabled）、Piercing/Piercing Crits（getWeaponRuleParam）；step5 Saturate 顺带并入阵营 saturateFromAbility（修正显示不一致）。
  - 2c 伤害：Devastating（immediateCritDmg）、Toxic（dmgBonusIfPoisoned）、Stun（targetAplReduction）、Poison（applyPoisonTokenOnDamage）、PSYCHIC（perilOnFailValue）、Hot（selfDamageOnLowRoll）；移除冗余的 recalculateAttackStats Toxic 预置块。
- ✅ **阶段 3（UI 门控规则）**：Heavy / Indirect Fire / Seek Light / Silent / Range 改读 `weaponMods` / `weaponHasRule` / `getWeaponRuleParam`。涉及 combat.js（武器选择、QA 步骤、openShootWizard）、ui.js（射击按钮 Silent/Heavy 门控）、actions.js（Shoot 的 Silent/Heavy 门控）。Seek/Seek Light 通过注册表 `concealNoCover` + `onlyLightTerrain` 区分。
- ✅ **阶段 4a（交互规则参数/检测迁移）**：Blast/Torrent 半径与触发（`getWeaponRuleParam` / `aoePrimarySecondary` / `aoeRadius`）、Limited 计数（`getWeaponRuleParam`）、Shock 近战（`firstCritDiscardsUnresolvedNormal`）、Brutal（`defenseBlockRequiresCrit`）、Balanced 基础检测（`rerollOneAttackDie`）、step6 Severe（`upgradeNormalToCrit` source）、防御 Saturate/Piercing、近战 Toxic/Poison/Stun、openShootWizard 多目标/重投日志检测、meleeCritThreshold helper 全部迁至注册表。顺带修正：近战 Toxic 之前漏 factionMechanicsEnabled 门控，已补（与射击侧一致）。
  - 注：Balanced/Ceaseless/Relentless 的**完整重投交互**仍属第 3 层缺失功能（需骰子重投 UI），本轮仅迁移检测源。
- ✅ **阶段 4b（阵营派生规则统一为注入式）**：新增 `injectedFactionRules(attacker, weapon)` + `effectiveWeapon(weapon, attacker)` helper，把 Khorne/Tzeentch→Severe、Aggressive→Rending、Siege→Saturate、Sharpshooter→Accurate+Severe 注入武器规则，经 `weaponMods(effectiveWeapon(...))` 统一判定。移除 `wizardState.severeFromAbility`/`saturateFromAbility` 标志及其全部读写点。
  - **行为修正（预期）**：阵营派生 Severe 此前因 1B 移除错误块而**实际失效**（只 log 不升级），现在经 effectiveWeapon 真正生效（step6 升级）。Accurate 基础+Sharpshooter 现按文档合并为 ≤2（此前 base 优先不叠加）。
  - 非武器规则的阵营效果（Blood for Blood God / Implacable / Hardy / Repulsive Fortitude 等 ploy 与防御被动）不在注入范畴，保留原 gated 实现。

---

## 第 3 层 — 缺失/简化的武器规则功能（✅ 已全部实现）

| 规则 | 文档 | 现状 |
|---|---|---|
| 无休 Ceaseless | 重投所有指定点数攻击骰 | ✅ 免费重投 UI：攻击骰视图按出现的点数给"重投所有 X"按钮（收割机枪等） |
| 毫不留情 Relentless | 重投任意攻击骰 | ✅ 免费重投 UI：点击骰子多选 + "确认重投选中" |
| 平衡 Balanced（基础） | 重投 1 颗攻击骰 | ✅ 免费重投 UI：点击任意骰子重投 1 颗（ploy 派生 Balanced 仍用自动近似） |
| 追踪 Seek（纯） | 目标不能用地形获掩护 | ✅ 与 Seek Light 同处理（强制 inCover=false），文案区分"寻的/寻光" |
| 毁灭 Devastating 距离前缀 | `1" Devastating x` 对距离内可见特工也伤害 | ✅ handleDevastatingAoe：保留暴击时弹次要目标选择，每个受 (暴击数×x) 伤害（几何靠玩家自判；与 Blast/Torrent 互斥避免双 modal） |
| 精准 Accurate 多实例 | 多实例→Accurate 2 | ✅ 阶段 2 已修（注册表合并） |
| 爆炸 Blast / 洪流 Torrent | 主+次目标溅射、半径 x、分别投骰 | ✅ autoResolveSecondaryAttack：每个次要目标独立完整结算（自投攻击骰、暴击/普通分算、保留阶段规则、防御骰、正确对消级联、暴击=criticalDamage）；半径/控制范围提示玩家自判 |

注：现役武器覆盖 — Torrent 4 把（手持火焰喷射器/自动爆弹步枪/瘟疫之风/瘟疫喷射器）、Ceaseless 1 把（收割机枪）；Blast/Devastating AoE/纯 Seek 无现役武器（面向未来）。几何类约束（Blast 半径、Torrent 控制范围、Devastating 距离、可见）均靠玩家手动确认（工具无坐标模型，见第 4 层）。

---

## 第 4 层 — 几何类规则（设计取舍，维持现状）

工具无坐标/位置模型（Operative 无 position 字段），所有几何判定一律"玩家手动确认"，是 tabletop 伴随工具的合理取舍：

- 可见（画线）、控制范围进出、掩护距离阈值、降落区 3"、部署轮替 → 玩家肉眼判断。
- 副作用：`CONTROL_RANGE=1`、`COVER_CLOSE_THRESHOLD=2`、`CHARGE_STICKY` 三个常量是死代码（UI 文案硬编码数字）。
- 掩体相关交互本身实现正确：掩护免费保留 1 枚普通成功防御骰、Saturate 移除、Indirect Fire 跳过视线、Seek Light 忽略掩体。

除非做棋盘数字化，否则维持现状。

---

## 核心规则差异（非武器，按需处理）

| # | 规则 | 文档 | 代码 | 状态 |
|---|---|---|---|---|
| C-1 | 反应可执行的行动 | 任意 1AP 行动（L73） | 强制只能 Reposition | ✅ 已修：允许移动≤2"/射击/近战，禁冲锋/冲刺/后撤 |
| C-2 | 冲刺 Dash 后效 | Dash=Reposition，无战斗限制（L89） | 额外规定 Dash 后不能射击/近战 | ✅ 已修：Dash 对齐 Reposition |
| C-3 | 防御骰数量 | 固定 3 枚 | 用 `operative.df` | ⚪ 无需改：当前全部 operative df=3，行为一致 |
| C-4 | 近战暴击判定 | 支持 Lethal x+ | 硬编码 `val===6`，不读 Lethal | ✅ 已修：3 处用 `meleeCritThreshold()` 读 Lethal（Daemon Blade/Flensing Blades 生效） |
| - | 后撤前置 | 必须在敌方控制范围内 | 无校验 | ⚪ 几何类，维持现状 |
| - | 冲锋前置 | 已在控制范围内不能再冲 | 未实现 | ⚪ 几何类，维持现状 |

---

## 已正确实现（无需动）

4 TP、开局 2CP、TP1 各+1、TP2+ 先攻+1/非先攻+2、计谋 1CP、指挥重掷 1CP、先攻掷骰平局重投、转移=Move/1AP、冲刺=3"/1AP、后撤=Move/2AP、冲锋=Move+2"/1AP、Counteract APL=1/每 TP 每 operative 限 1 次、Injured 移动-2"+命中-1（APL 不减）、伤害映射、四种抵挡关系、Parry。
武器规则已正确：Brutal、Hot、Lethal、Limited、Piercing、Piercing Crits、Punishing、Rending、Saturate、Shock、Silent、Stun。

---

## 修复进度

- [x] **1A**（4 处阵营门控）+ **1B**（Severe 错误块移除）— 已完成，`npm run build` 通过
- [x] **1C**（Heavy 重写）— 已完成，按 "Dash only" 语义
- [x] **核心规则差异** C-1/C-2/C-4（反应范围、Dash 后效、近战 Lethal）— 已完成；C-3 防御骰因数据全 df=3 无需改；后撤/冲锋前置属几何类维持现状
- [x] **第 2 层 weapons.js 迁移** — 阶段 1+2+3+4 全部完成；注册表成为武器规则单一来源（含阵营派生注入）
- [x] **第 3 层缺失武器规则** — 全部实现：Ceaseless/Relentless/Balanced 重投 UI、纯 Seek、Devastating AoE、Blast/Torrent 多目标正确分算、Accurate 多实例合并
