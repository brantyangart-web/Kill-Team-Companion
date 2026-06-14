# Kill Team 2024 Ploy 完整规范文档

> **用途**: 本文档从官方规则文档中提取所有 Ploy 的完整规则文本，供 Companion App 重写 Ploy 系统使用。
>
> **数据来源**:
> - Lite Rules (核心规则 + Command Re-roll)
> - Angels of Death Team Rules (Space Marine 阵营 ploys) — January '26 Errata
> - Plague Marines Team Rules (Plague Marine 阵营 ploys) — April '26 Errata
> - Legionaries Online Rules (Legionary 阵营 ploys) — October '25 Errata
>
> **最后更新**: 2026-06-14

---

## 目录

1. [通用 Ploy（核心规则）](#1-通用-ploy核心规则)
2. [Space Marine / Angels of Death Ploys](#2-space-marine--angels-of-death-ploys)
3. [Plague Marine Ploys](#3-plague-marine-ploys)
4. [Legionary Ploys](#4-legionary-ploys)
5. [Faction Equipment（战略性装备）](#5-faction-equipment战略性装备)
6. [对比表：App 当前实现 vs 官方规则](#6-对比表app-当前实现-vs-官方规则)
7. [实现建议](#7-实现建议)

---

## 1. 通用 Ploy（核心规则）

### 1.1 Command Re-roll

| 字段 | 值 |
|------|-----|
| **阵营** | 通用 (所有阵营) |
| **Ploy 名称** | Command Re-roll / 指挥重投 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 投掷攻击骰或防御骰之后 |
| **持续时间** | 一次性 |
| **效果描述** | "Use this firefight ploy after rolling your attack or defence dice. You can re-roll one of those dice." |
| **影响范围** | 所有 operative |
| **使用限制** | 每次攻击/防御序列可使用；不计入每 TP 一次的 ploy 限制 |
| **规则引用** | Lite Rules — FIREFIGHT PHASE 段落 |

---

## 2. Space Marine / Angels of Death Ploys

### 2.1 Strategy Ploys

#### 2.1.1 Combat Doctrine / 战斗教条

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | Combat Doctrine / 战斗教条 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (直到使用 Adjust Doctrine 更改，或回合结束) |
| **效果描述** | "Select one COMBAT DOCTRINE from those presented below. Whenever a friendly ANGEL OF DEATH operative is X, its weapons have the Balanced weapon rule." |
| **选项** | **Devastator Doctrine**: Shooting an operative more than 6" from it. <br> **Tactical Doctrine**: Shooting an operative within 6" of it. <br> **Assault Doctrine**: Fighting or retaliating. |
| **影响范围** | 所有 friendly ANGEL OF DEATH operatives |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **特殊交互** | Captain Heroic Leader 可在激活时额外使用 (pay CP); Sergeant Doctrine Warfare 可免费使用特定教条 (once per battle) |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH STRATEGY PLOY: COMBAT DOCTRINE |

#### 2.1.2 And They Shall Know No Fear / 无所畏惧

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | And They Shall Know No Fear / 无所畏惧 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "You can ignore any changes to the stats of friendly ANGEL OF DEATH operatives from being injured (including their weapons' stats)." |
| **影响范围** | 所有 friendly ANGEL OF DEATH operatives |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 受伤 (injured) 通常: Move -2", 武器 Hit +1。此 ploy 激活后忽略这些减益。 |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH STRATEGY PLOY: AND THEY SHALL KNOW NO FEAR |

#### 2.1.3 Adaptive Tactics / 自适应战术

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | Adaptive Tactics / 自适应战术 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 直到当前 turning point 结束 (之后恢复原 secondary CHAPTER TACTIC) |
| **效果描述** | "Change your secondary CHAPTER TACTIC. Note this ploy only lasts until the end of the turning point, at which point your original secondary CHAPTER TACTIC returns." |
| **影响范围** | 所有 friendly ANGEL OF DEATH operatives |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 需要从 8 个 CHAPTER TACTIC 中选择一个新的 secondary: Aggressive, Dueller, Resolute, Stealthy, Mobile, Hardy, Sharpshooter, Siege Specialist |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH STRATEGY PLOY: ADAPTIVE TACTICS |

#### 2.1.4 Indomitus / 不屈意志

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | Indomitus / 不屈意志 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "Whenever an operative is shooting a friendly ANGEL OF DEATH operative, if you roll two or more fails, you can discard one of them to retain another as a normal success instead." |
| **影响范围** | 所有 friendly ANGEL OF DEATH operatives (作为防御方时) |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 防御骰结算时: 如果 roll 出 2+ 个 fail，可以 discard 1 个 fail 将另 1 个 fail 保留为 normal success。 |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH STRATEGY PLOY: INDOMITUS |

### 2.2 Firefight Ploys

#### 2.2.1 Adjust Doctrine / 调整教条

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | Adjust Doctrine / 调整教条 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP (Captain 使用时为 0CP) |
| **生效时机** | 在 friendly ANGEL OF DEATH operative 的 activation 期间，在其执行某个 action 之前或之后 |
| **持续时间** | 一次性 (更改当前 Combat Doctrine 选择) |
| **效果描述** | "Use this firefight ploy during a friendly ANGEL OF DEATH operative's activation, before or after it performs an action. If you've used the Combat Doctrine strategy ploy during this turning point, change the COMBAT DOCTRINE you selected." |
| **影响范围** | 所有 friendly ANGEL OF DEATH operatives |
| **使用限制** | 每个 TP 一次 (Firefight Ploy 限制); 前提是本 TP 已使用 Combat Doctrine |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH FIREFIGHT PLOY: ADJUST DOCTRINE |

#### 2.2.2 Transhuman Physiology / 超人耐力

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | Transhuman Physiology / 超人耐力 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当敌方 operative 正在射击 friendly ANGEL OF DEATH operative 时，在 Roll Defence Dice 步骤中 |
| **持续时间** | 一次性 (仅影响当前防御骰结算) |
| **效果描述** | "Use this firefight ploy when an operative is shooting a friendly ANGEL OF DEATH operative, in the Roll Defence Dice step. You can retain one of your normal successes as a critical success instead." |
| **影响范围** | 被射击的 friendly ANGEL OF DEATH operative |
| **使用限制** | 每个 TP 一次 |
| **实现要点** | 防御方投完防御骰后，可将 1 个 normal success 升级为 critical success。critical success 可以 block normal 或 critical attack dice。 |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH FIREFIGHT PLOY: TRANSHUMAN PHYSIOLOGY |

#### 2.2.3 Shock Assault / 冲击突击

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | Shock Assault / 冲击突击 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当 friendly ANGEL OF DEATH operative 在当前 activation 中执行过 Charge action 后，正在执行 Fight action 时，在 Resolve Attack Dice 步骤开始时使用 |
| **持续时间** | 仅该次 Fight action 持续 |
| **效果描述** | "Use this firefight ploy when a friendly ANGEL OF DEATH operative is performing the Fight action during an activation in which it performed the Charge action, at the start of the Resolve Attack Dice step. Until the end of that action: <br>- Its melee weapon has the Shock weapon rule. <br>- The first time you strike during that sequence, inflict 1 additional damage (to a maximum of 7)." |
| **影响范围** | 执行 Charge+Fight 的 friendly ANGEL OF DEATH operative |
| **使用限制** | 每个 TP 一次; 前提是该 operative 本 activation 已执行 Charge |
| **实现要点** | 1) 近战武器获得 Shock 规则 (第一次 critical strike 时 discard 对手 1 个未结算 normal success)。2) 第一次 strike 额外造成 1 伤害 (上限 7)。 |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH FIREFIGHT PLOY: SHOCK ASSAULT |

#### 2.2.4 Wrath of Vengeance / 复仇之怒

| 字段 | 值 |
|------|-----|
| **阵营** | Space Marine (Angels of Death) |
| **Ploy 名称** | Wrath of Vengeance / 复仇之怒 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP (有 Chapter Reliquaries 装备且 Engage order 时为 0CP) |
| **生效时机** | 当 friendly ANGEL OF DEATH operative 正在 counteracting 时使用 |
| **持续时间** | 仅该次 counteraction |
| **效果描述** | "Use this firefight ploy when a friendly ANGEL OF DEATH operative is counteracting. It can perform an additional 1AP action for free during that counteraction, but both actions must be different." |
| **影响范围** | 正在 counteracting 的 friendly ANGEL OF DEATH operative |
| **使用限制** | 每个 TP 一次 |
| **实现要点** | 正常 counteraction 只能执行 1 个 1AP action。此 ploy 允许额外执行 1 个 1AP action (免费)，但两个 action 必须不同。 |
| **规则引用** | AoD Team Rules — ANGEL OF DEATH FIREFIGHT PLOY: WRATH OF VENGEANCE |

---

## 3. Plague Marine Ploys

### 3.1 Strategy Ploys

#### 3.1.1 Contagion / 传染蔓延

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Contagion / 传染蔓延 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP (Icon Bearer 在对手领土时为 0CP) |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "Subtract 2" from the Move stat of an enemy operative and worsen the Hit stat of its weapons by 1 (this isn't cumulative with being injured) whenever any of the following are true: <br>- It has one of your Poison tokens and is visible to (or vice versa) and within 3" of friendly PLAGUE MARINE operatives. <br>- It's visible to (or vice versa) and within 3" of a friendly PLAGUE MARINE ICON BEARER operative." |
| **影响范围** | 满足条件的敌方 operatives |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 条件判断: (有 Poison token 且在 PM 3" 内可见) OR (在 Icon Bearer 3" 内可见)。效果: Move -2", 武器 Hit +1 (不与受伤叠加)。 |
| **Errata (Apr '26)** | 删除了原第一个条件 "It's within control range of friendly PLAGUE MARINE operatives" |
| **规则引用** | PM Team Rules — PLAGUE MARINE STRATEGY PLOY: CONTAGION |

#### 3.1.2 Lumbering Death / 缓慢死神

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Lumbering Death / 缓慢死神 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "Whenever a friendly PLAGUE MARINE operative is shooting or fighting during an activation in which it hasn't moved more than 3", or whenever it's retaliating, its weapons have the Ceaseless weapon rule." |
| **影响范围** | 所有 friendly PLAGUE MARINE operatives |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 条件: 该 operative 在本次 activation 中移动不超过 3" (或正在 retaliating)。效果: 武器获得 Ceaseless (可重投指定一个点数的攻击骰)。 |
| **规则引用** | PM Team Rules — PLAGUE MARINE STRATEGY PLOY: LUMBERING DEATH |

#### 3.1.3 Cloud of Flies / 蝇云

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Cloud of Flies / 蝇云 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 直到下一个 Strategy phase 的 Ready 步骤移除 |
| **效果描述** | "Place one of your Cloud of Flies markers in the killzone. Whenever an operative is shooting a friendly PLAGUE MARINE operative that's more than 3" from it, if that friendly operative is wholly within 1" of that marker, that friendly operative is obscured. In the Ready step of the next Strategy phase, remove that marker." |
| **影响范围** | 所有 friendly PLAGUE MARINE operatives (在 marker 附近时) |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 放置 marker。当敌方射击 PM 且: (1) 距离 > 3", (2) PM wholly within marker 1" 内 → PM 视为 obscured (不能被选为有效目标，除非有其他手段)。下回合 Ready 步骤移除。 |
| **Errata (Apr '26)** | "wholly within 1"" 措辞确认 |
| **规则引用** | PM Team Rules — PLAGUE MARINE STRATEGY PLOY: CLOUD OF FLIES |

#### 3.1.4 Nurglings / 纳格林

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Nurglings / 纳格林 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 直到被选中敌方 operative 的下一个 activation 结束 |
| **效果描述** | "Select one enemy operative within 3" of a friendly PLAGUE MARINE operative, or one enemy operative that has one of your Poison tokens and is within 7" of a friendly PLAGUE MARINE operative. Until the end of the selected operative's next activation, subtract 1 from its APL stat." |
| **影响范围** | 1 个满足条件的敌方 operative |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 目标条件: (在 PM 3" 内) OR (有 Poison token 且在 PM 7" 内)。效果: APL -1 直到其下次 activation 结束。 |
| **规则引用** | PM Team Rules — PLAGUE MARINE STRATEGY PLOY: NURGLINGS |

### 3.2 Firefight Ploys

#### 3.2.1 Virulent Poison / 剧毒扩散

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Virulent Poison / 剧毒扩散 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 在 friendly PLAGUE MARINE operative 的 activation 或 counteraction 期间，在其执行某个 action 之前或之后 |
| **持续时间** | 一次性 |
| **效果描述** | "Use this firefight ploy during a friendly PLAGUE MARINE operative's activation or counteraction, before or after it performs an action. Select one of the following: <br>- One enemy operative within 3" of, or visible to and within 7" of, that operative gains one of your Poison tokens (if it doesn't already have one). <br>- Roll 2D6: if the result is 7+, one enemy operative within 7" of that operative gains one of your Poison tokens (if it doesn't already have one)." |
| **影响范围** | 1 个敌方 operative |
| **使用限制** | 每个 TP 一次 |
| **实现要点** | 两个选项: (1) 直接给 3" 内或 7" 内可见敌方施加 Poison token; (2) 投 2D6，7+ 则给 7" 内敌方施加 Poison token。 |
| **Errata (Apr '26)** | 新增第二个 2D6 选项 |
| **规则引用** | PM Team Rules — PLAGUE MARINE FIREFIGHT PLOY: VIRULENT POISON |

#### 3.2.2 Poisonous Demise / 毒亡爆发

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Poisonous Demise / 毒亡爆发 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当 friendly PLAGUE MARINE operative 被 incapacitated 时，在其被移出 killzone 之前 |
| **持续时间** | 一次性 |
| **效果描述** | "Use this firefight ploy when a friendly PLAGUE MARINE operative is incapacitated, before it's removed from the killzone. Each enemy operative visible to and within 3" of that operative gains one of your Poison tokens (if they don't already have one); for each of those enemy operatives that already has one of your Poison tokens (including if they gained one during this action), inflict 1 damage on them instead." |
| **影响范围** | 3" 内可见的所有敌方 operatives |
| **使用限制** | 每个 TP 一次 |
| **实现要点** | 触发: PM operative 死亡时。效果: 3" 内可见敌方获得 Poison token; 已有 token 的改为受到 1 伤害。 |
| **Errata (Apr '26)** | 增加了 "before it's removed from the killzone" 时限说明 |
| **规则引用** | PM Team Rules — PLAGUE MARINE FIREFIGHT PLOY: POISONOUS DEMISE |

#### 3.2.3 Sickening Resilience / 恶心坚韧

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Sickening Resilience / 恶心坚韧 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当攻击骰对 friendly PLAGUE MARINE operative 造成伤害时 |
| **持续时间** | 直到当前 activation 或 counteraction 结束 |
| **效果描述** | "Use this firefight ploy when an attack dice inflicts damage on a friendly PLAGUE MARINE operative. Until the end of the activation or counteraction, for the purposes of the Disgustingly Resilient rule for that operative, always subtract 1 from the damage inflicted (to a minimum of 2) – you don't need to roll." |
| **影响范围** | 被攻击的 friendly PLAGUE MARINE operative |
| **使用限制** | 每个 TP 一次 |
| **实现要点** | Disgustingly Resilient 通常: 3+ 伤害时投 D6, 4+ 减 1。此 ploy: 无需投骰，自动减 1 (最低 2 伤害)。持续到当前 activation/counteraction 结束。 |
| **规则引用** | PM Team Rules — PLAGUE MARINE FIREFIGHT PLOY: SICKENING RESILIENCE |

#### 3.2.4 Curse of Rot / 腐朽诅咒

| 字段 | 值 |
|------|-----|
| **阵营** | Plague Marine |
| **Ploy 名称** | Curse of Rot / 腐朽诅咒 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当 friendly PLAGUE MARINE operative 正在射击或近战对战某个敌方 operative 时 (条件: 敌方在其 3" 内, 或有 Poison token 且在 7" 内)，在对手投完攻击骰或防御骰之后 |
| **持续时间** | 一次性 (仅影响当前骰子结算) |
| **效果描述** | "Use this firefight ploy when a friendly PLAGUE MARINE operative is shooting against or fighting against an enemy operative within 3" of it (or within 7" of it if that enemy operative has one of your Poison tokens), after your opponent rolls their attack or defence dice. For each result of 3 they roll, inflict 1 damage on that enemy operative, that result cannot be retained as a success and they cannot re-roll it." |
| **影响范围** | 被射击/近战的敌方 operative |
| **使用限制** | 每个 TP 一次 |
| **实现要点** | 对手骰子中每个结果为 3 的骰子: 对敌方造成 1 伤害, 不能保留为 success, 不能重投。 |
| **Errata (Apr '26)** | 措辞调整为 "that result cannot be retained as a success and they cannot re-roll it" |
| **规则引用** | PM Team Rules — PLAGUE MARINE FIREFIGHT PLOY: CURSE OF ROT |

---

## 4. Legionary Ploys

### 4.1 Strategy Ploys

#### 4.1.1 Blood for the Blood God / 血祭血神

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Blood for the Blood God / 血祭血神 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "Whenever a friendly LEGIONARY operative (excluding KHORNE) is fighting, the first time you strike during that sequence, inflict 1 additional damage (to a maximum of 7). <br><br>Add 1 to both Dmg stats of friendly LEGIONARY KHORNE operatives' melee weapons (to a maximum of 7)." |
| **影响范围** | 所有 friendly LEGIONARY operatives (分两组效果) |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 非 KHORNE operatives: Fight 时第一次 strike +1 伤害 (上限 7)。KHORNE operatives: 近战武器 Normal Dmg 和 Critical Dmg 各 +1 (上限 7)。 |
| **Errata (Oct '25)** | 增加了 "(to a maximum of 7)" 上限 |
| **规则引用** | Legionary Rules — LEGIONARY STRATEGY PLOY: BLOOD FOR THE BLOOD GOD |

#### 4.1.2 Implacable / 坚定不移

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Implacable / 坚定不移 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "Whenever an operative is shooting a friendly LEGIONARY operative, weapons with the Piercing 1 weapon rule have the Piercing Crits 1 weapon rule instead. <br><br>You can ignore any changes to the stats of friendly LEGIONARY NURGLE operatives from being injured (including their weapons' stats)." |
| **影响范围** | 所有 friendly LEGIONARY operatives (射击防御); LEGIONARY NURGLE operatives (忽略受伤减益) |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 效果1: Piercing 1 降级为 Piercing Crits 1 (只在 retain critical success 时才生效)。效果2: NURGLE operatives 忽略受伤减益 (Move -2", Hit +1)。 |
| **Errata (Oct '25)** | 段落重排，NURGLE 关键词移至第二段 |
| **规则引用** | Legionary Rules — LEGIONARY STRATEGY PLOY: IMPLACABLE |

#### 4.1.3 Quicksilver Speed / 疾速银影

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Quicksilver Speed / 疾速银影 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "Whenever a friendly LEGIONARY operative that performed an action in which it moved during this turning point is fighting or retaliating, worsen the Hit stat of the enemy operative's melee weapons by 1. <br><br>Whenever an operative is shooting a friendly LEGIONARY SLAANESH operative more than 6" from it that performed an action in which it moved during this turning point, worsen the Hit stat of the enemy operative's weapons by 1. <br><br>In all cases for this ploy, this isn't cumulative with being injured." |
| **影响范围** | 所有 friendly LEGIONARY operatives (近战时); LEGIONARY SLAANESH operatives (被射击时) |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 条件1 (通用): LEGIONARY operative 在本 TP 内执行过包含移动的行动 → Fight/Retaliate 时敌方近战武器 Hit +1。条件2 (SLAANESH): SLAANESH operative 在本 TP 内移动过 → 被 6" 外射击时敌方武器 Hit +1。不与受伤叠加。 |
| **Errata (Oct '25)** | 第一段增加 "or retaliating" |
| **规则引用** | Legionary Rules — LEGIONARY STRATEGY PLOY: QUICKSILVER SPEED |

#### 4.1.4 Fickle Fates / 命运无常

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Fickle Fates / 命运无常 |
| **类型** | Strategy Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | Strategy phase |
| **持续时间** | 持久 (整个战斗剩余时间) |
| **效果描述** | "Whenever a friendly LEGIONARY operative is shooting a ready enemy operative, that friendly operative's ranged weapons have the Balanced weapon rule; if the weapon already has that weapon rule (e.g. reaper chaincannon), it has the Relentless weapon rule. <br><br>Whenever an operative is shooting a ready friendly LEGIONARY TZEENTCH operative, in the Roll Defence Dice step, if you retain any critical successes, you can retain one of your fails as a normal success instead of discarding it." |
| **影响范围** | 所有 friendly LEGIONARY operatives (射击 ready 敌人时); LEGIONARY TZEENTCH operatives (被射击时) |
| **使用限制** | 每个 TP 一次 (STRATEGIC GAMBIT) |
| **实现要点** | 效果1: 射击 ready 敌方时武器获得 Balanced (重投 1 个攻击骰); 已有 Balanced 则升级为 Relentless (可重投任意攻击骰)。效果2: TZEENTCH operative 被射击时, 防御骰保留 critical success 后可保留 1 个 fail 为 normal success。 |
| **Errata (Oct '25)** | 第一段增加 "if the weapon already has that weapon rule, it has the Relentless weapon rule" |
| **规则引用** | Legionary Rules — LEGIONARY STRATEGY PLOY: FICKLE FATES |

### 4.2 Firefight Ploys

#### 4.2.1 Unending Bloodshed / 无尽杀戮

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Unending Bloodshed / 无尽杀戮 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当 friendly LEGIONARY KHORNE operative 在 Fight 或 Retaliate 中被 incapacitated 时 |
| **持续时间** | 一次性 (在被移出 killzone 之前) |
| **效果描述** | "Use this firefight ploy when a friendly LEGIONARY KHORNE operative is incapacitated while fighting or retaliating. You can strike the enemy operative in that sequence with one of your unresolved successes before it's removed from the killzone." |
| **影响范围** | 被 incapacitated 的 LEGIONARY KHORNE operative |
| **使用限制** | 每个 TP 一次; 仅限 KHORNE operatives |
| **实现要点** | KHORNE operative 在 Fight/Retaliate 中死亡时，可用 1 个未结算的 success 对敌方 strike。 |
| **规则引用** | Legionary Rules — LEGIONARY FIREFIGHT PLOY: UNENDING BLOODSHED |

#### 4.2.2 Mutability and Change / 变异与转化

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Mutability and Change / 变异与转化 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当 friendly LEGIONARY TZEENTCH operative 被 activated 时 |
| **持续时间** | 直到该 operative 的 activation 结束 |
| **效果描述** | "Use this firefight ploy when a friendly LEGIONARY TZEENTCH operative is activated. Until the end of that operative's activation, add 1 to its APL stat, but it cannot perform the same action more than once during that activation. If it's a WARRIOR operative, that operative's Marks of Chaos keyword cannot be changed during this turning point (see Infernal Pact additional rule)." |
| **影响范围** | 被激活的 LEGIONARY TZEENTCH operative |
| **使用限制** | 每个 TP 一次; 仅限 TZEENTCH operatives |
| **实现要点** | APL +1, 但不能重复执行相同 action。WARRIOR operative 额外限制: 本 TP 内不能通过 Infernal Pact 改变 Marks of Chaos。 |
| **Errata (Oct '25)** | 增加 WARRIOR Infernal Pact 限制 |
| **规则引用** | Legionary Rules — LEGIONARY FIREFIGHT PLOY: MUTABILITY AND CHANGE |

#### 4.2.3 Malignant Aura / 恶性灵光

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Malignant Aura / 恶性灵光 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 当 friendly LEGIONARY NURGLE operative 正在执行 Shoot action 并选择 valid target 时 |
| **持续时间** | 直到该次 Shoot action 结束 |
| **效果描述** | "Use this firefight ploy when a friendly LEGIONARY NURGLE operative is performing the Shoot action, when you select a valid target. Until the end of that action, whenever that friendly operative is shooting an enemy operative within 3" of it (i.e. including secondary targets, if any), that friendly operative's ranged weapons have the Piercing 1 weapon rule." |
| **影响范围** | 执行 Shoot 的 LEGIONARY NURGLE operative |
| **使用限制** | 每个 TP 一次; 仅限 NURGLE operatives |
| **实现要点** | 射击 3" 内敌方 (含 Blast/Torrent secondary targets) 时远程武器获得 Piercing 1 (防御方减少 1 个防御骰)。 |
| **规则引用** | Legionary Rules — LEGIONARY FIREFIGHT PLOY: MALIGNANT AURA |

#### 4.2.4 Sickening Captivation / 魅惑厌恶

| 字段 | 值 |
|------|-----|
| **阵营** | Legionary |
| **Ploy 名称** | Sickening Captivation / 魅惑厌恶 |
| **类型** | Firefight Ploy |
| **CP 花费** | 1 CP |
| **生效时机** | 在 friendly LEGIONARY SLAANESH operative 的 activation 期间，在其执行某个 action 之前或之后 |
| **持续时间** | 直到被选中敌方 operative 的下一个 activation 结束 |
| **效果描述** | "Use this firefight ploy during a friendly LEGIONARY SLAANESH operative's activation, before or after it performs an action. Select one enemy operative visible to and within 4" of that friendly operative. Until the end of that enemy operative's next activation, subtract 1 from its APL stat." |
| **影响范围** | 1 个满足条件的敌方 operative |
| **使用限制** | 每个 TP 一次; 仅限 SLAANESH operatives |
| **实现要点** | 选择 4" 内可见敌方 → APL -1 直到其下次 activation 结束。 |
| **规则引用** | Legionary Rules — LEGIONARY FIREFIGHT PLOY: SICKENING CAPTIVATION |

---

## 5. Faction Equipment（战略性装备）

Faction Equipment 不是 Ploy，但部分装备以 STRATEGIC GAMBIT 形式使用，与 ploy 系统深度交互。

### 5.1 Space Marine Faction Equipment

| 装备名 | 类型 | 效果 |
|--------|------|------|
| **Chapter Reliquaries** | 被动 | Wrath of Vengeance 对 Engage order operative 免费 (0CP) |
| **Tilting Shields** | 一次性/TP | Fight/Retaliate 时，对手 roll 攻击骰后、重投前，对手不能将 <6 的结果保留为 critical success |
| **Auspex** | 一次性/TP | Shoot 时直到 activation 结束，8" 内敌方不能被 obscured |
| **Purity Seals** | 被动 | Shoot/Fight/Retaliate 时 roll 出 2+ fail，可 discard 1 个保留另 1 个为 normal success |

### 5.2 Plague Marine Faction Equipment

| 装备名 | 类型 | 效果 |
|--------|------|------|
| **Plague Bells** | 被动 | 忽略所有 friendly PM operatives 的受伤减益 |
| **Blight Grenades** | 武器 | 增加 Blight Grenade 武器 (Range 6", Blast 2", Saturate, Severe, Poison) |
| **Plague Rounds** | 被动 | boltgun 和 bolt pistol 获得 Poison + Severe 规则 |
| **Poison Vents** | 被动 | 敌方在 PM 3" 内被激活时: 无 token 投 D3 (3 获得 token); 有 token 受 D3 伤害 |

### 5.3 Legionary Faction Equipment

| 装备名 | 类型 | 效果 |
|--------|------|------|
| **Warded Armour** | STRATEGIC GAMBIT | 选 1 个 friendly LEGIONARY → Save 变为 2+ 直到下回合 Ready 步骤 |
| **Tainted Rounds** | 一次性/TP | Shoot 时 bolt pistol/boltgun 获得 Rending 直到 action 结束 |
| **Chaos Talismans** | STRATEGIC GAMBIT | 选 1 个 Marks of Chaos。该关键词 operative 射击/近战/反击时 2+ fail 可受 D3 伤害换 discard 1 fail 保留另 1 个为 normal success |
| **Malefic Blades** | 被动 | 所有 friendly LEGIONARY 增加 Malefic Blade 近战武器 (5 ATK, 3+, 3/4 Dmg) |

---

## 6. 对比表：App 当前实现 vs 官方规则

### 6.1 Space Marine Ploys

| App 当前 Ploy ID | App 中文名 | App 描述 | 官方 Ploy | 一致性 | 问题 |
|---|---|---|---|---|---|
| `bolter_discipline` | 风暴开火 | 特工在使用爆弹类武器时可进行第二次射击行动 | **不存在** | ❌ 完全错误 | 官方无此 ploy。Astartes 双重行动是**被动阵营规则** (无需 CP)，不是 ploy。App 将其错误实现为需消耗 1CP 的 strategy ploy。 |
| `shock_assault` | 震慑突击 | 冲锋后近战搏斗时获得额外重投 | Shock Assault (Firefight) | ⚠️ 部分正确 | 1) 类型错误: 应为 **Firefight Ploy**，App 标为 Strategic。2) 效果错误: 官方是获得 Shock 规则 + 第一次 strike +1 伤害 (max 7)，不是"重投"。3) 触发条件: 需要 Charge+Fight 组合。 |
| `transhuman` | 极限减伤 | 遭到致命一击时可将 1 个暴击伤害降为普通伤害 | Transhuman Physiology (Firefight) | ⚠️ 部分正确 | 1) 类型错误: 应为 **Firefight Ploy**，App 标为 Firefight 但描述不对。2) 效果错误: 官方是将 1 个**防御 normal success 升级为 critical success**，不是减伤。 |
| — | — | — | Combat Doctrine | ❌ **缺失** | 核心 strategy ploy，选择 Devastator/Tactical/Assault 教条获得 Balanced。 |
| — | — | — | And They Shall Know No Fear | ❌ **缺失** | 忽略受伤减益。 |
| — | — | — | Adaptive Tactics | ❌ **缺失** | 临时更换 secondary CHAPTER TACTIC。 |
| — | — | — | Indomitus | ❌ **缺失** | 防御射击时 2+ fail 可换 1 个。 |
| — | — | — | Adjust Doctrine | ❌ **缺失** | Firefight ploy，更改已选的 Combat Doctrine。 |
| — | — | — | Wrath of Vengeance | ❌ **缺失** | Firefight ploy，counteracting 时额外 1AP action。 |

### 6.2 Plague Marine Ploys

| App 当前 Ploy ID | App 中文名 | App 描述 | 官方 Ploy | 一致性 | 问题 |
|---|---|---|---|---|---|
| `inexorable_advance` | 无尽行军 | 忽略移动减损惩罚，强行推进 | **不存在** | ❌ 完全错误 | 官方无此 ploy。可能与 Lumbering Death 混淆，但效果完全不同。 |
| `malicious_volleys` | 剧毒喷洒 | 爆弹武器即使移动过也能双击 | **不存在** | ❌ 完全错误 | 官方无此 ploy。Astartes 双重行动是被动规则，且 PM 版限制 bolt pistol/boltgun/PSYCHIC。 |
| `contagious_resilience` | 恶心减伤 | 防守时可以将一枚失败骰改为普通成功 | Sickening Resilience (Firefight) | ⚠️ 部分正确 | 1) 类型错误: App 标为 Firefight (正确!) 但描述混合了 Sickening Resilience 和 Disgustingly Resilient。2) 官方 Sickening Resilience: DR 自动减伤不需投骰。3) 描述中的"改骰子"并非官方效果。 |
| — | — | — | Contagion | ❌ **缺失** | 核心 strategy ploy，Poison/Icon Bearer 附近敌方 Move -2", Hit +1。 |
| — | — | — | Lumbering Death | ❌ **缺失** | 移动 ≤3" 时武器获得 Ceaseless。 |
| — | — | — | Cloud of Flies | ❌ **缺失** | 放置 marker，附近 PM 被远距离射击时 obscured。 |
| — | — | — | Nurglings | ❌ **缺失** | 敌方 APL -1。 |
| — | — | — | Virulent Poison | ❌ **缺失** | 施加 Poison token。 |
| — | — | — | Poisonous Demise | ❌ **缺失** | PM 死亡时给周围敌方施加 Poison / 造成伤害。 |
| — | — | — | Curse of Rot | ❌ **缺失** | 对手骰出 3 的结果造成伤害且不能保留。 |

### 6.3 Legionary Ploys

| App 当前 Ploy ID | App 中文名 | App 描述 | 官方 Ploy | 一致性 | 问题 |
|---|---|---|---|---|---|
| `dark_zealotry` | 黑暗狂热 | 近战搏斗时可重投 1 个失败骰 | **不存在** (作为 ploy) | ❌ 概念错误 | Dark Zealotry **不是 ploy**。在官方规则中不存在此名称的 ploy。近战重投 1 个失败骰的效果类似于 Astartes 被动规则的变体，但 Legionary 官方并无此被动。 |
| `chaos_glory` | 混沌荣耀 | Leader 在 Fight 中获得 +1 攻击 | **不存在** | ❌ 完全错误 | 官方无此 ploy。+1 ATK 不是任何已知效果。 |
| `warp_touched` | 亚空间庇护 | 受到致命伤害时可掷骰 6+ 抵消 | **不存在** | ❌ 完全错误 | 官方无此 ploy。可能与 Unleash Daemon (Anointed operative 能力) 混淆。 |
| — | — | — | Blood for the Blood God | ❌ **缺失** | Fight 第一次 strike +1 dmg; KHORNE 近战 Dmg +1。 |
| — | — | — | Implacable | ❌ **缺失** | Piercing 1 降级为 Piercing Crits 1; NURGLE 忽略受伤。 |
| — | — | — | Quicksilver Speed | ❌ **缺失** | 移动过的 operative Fight 时敌方 Hit +1; SLAANESH 被远距离射击 Hit +1。 |
| — | — | — | Fickle Fates | ❌ **缺失** | 射击 ready 敌人获得 Balanced/Relentless; TZEENTCH 防御特殊保留。 |
| — | — | — | Unending Bloodshed | ❌ **缺失** | KHORNE 死亡时可 strike。 |
| — | — | — | Mutability and Change | ❌ **缺失** | TZEENTCH APL +1 但不能重复 action。 |
| — | — | — | Malignant Aura | ❌ **缺失** | NURGLE Shoot 3" 内获得 Piercing 1。 |
| — | — | — | Sickening Captivation | ❌ **缺失** | SLAANESH 4" 内敌方 APL -1。 |

### 6.4 总结统计

| 阵营 | 官方 Strategy Ploys | 官方 Firefight Ploys | App 实现数 | 正确实现 | 缺失 | 虚构 |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Space Marine** | 4 | 4 | 3 | 0 | 5 | 1 (`bolter_discipline`) |
| **Plague Marine** | 4 | 4 | 3 | 0 | 5 | 2 (`inexorable_advance`, `malicious_volleys`) |
| **Legionary** | 4 | 4 | 3 | 0 | 8 | 3 (`dark_zealotry`, `chaos_glory`, `warp_touched`) |
| **合计** | 12 | 12 | 9 | **0** | **18** | **6** |

> ⚠️ **结论**: App 当前的 9 个 ploy **全部**与官方规则不一致。其中 6 个是完全虚构的（官方不存在），3 个是部分正确但类型或效果有误。18 个官方 ploy 完全未被实现。

---

## 7. 实现建议

### 7.1 Ploy 系统架构

```
Ploy Definition Schema:
{
  id: string,           // 唯一标识, e.g. 'combat_doctrine'
  name_en: string,      // 英文名, e.g. 'Combat Doctrine'
  name_cn: string,      // 中文名, e.g. '战斗教条'
  faction: string,      // 阵营 id, e.g. 'Space Marine'
  type: 'strategy' | 'firefight',
  cp: number,           // 通常 1, 某些条件下可变为 0
  timing: PloyTiming,   // 何时可以使用
  duration: 'instant' | 'until_end_of_tp' | 'persistent' | 'until_next_activation',
  target: 'all_friendly' | 'specific_operative' | 'enemy' | 'marker',
  marks_of_chaos?: string,  // Legionary 特定: 'KHORNE' | 'NURGLE' | 'SLAANESH' | 'TZEENTCH' | null
  conditions: Condition[],  // 前置条件列表
  effects: Effect[],        // 效果列表
  usage_limit: 'per_tp' | 'per_battle' | 'unlimited',
  is_strategic_gambit: boolean,  // strategy ploys 都是 STRATEGIC GAMBIT
  free_conditions?: Condition[], // 免费使用的条件
}
```

### 7.2 关键实现注意事项

1. **Strategy Ploy = STRATEGIC GAMBIT**: 每个 strategy ploy 都是 STRATEGIC GAMBIT，每 TP 每个 GAMBIT 只能用一次。Firefight ploy 不是 STRATEGIC GAMBIT，但同样每 TP 每个只能用一次 (Command Re-roll 除外)。

2. **持久型 Ploy 的状态管理**: 多个 strategy ploy (如 And They Shall Know No Fear, Blood for the Blood God) 一旦激活，效果持续到战斗结束。需要在 gameState 中维护 `persistentPloys` 列表。

3. **Marks of Chaos 交互**: Legionary ploys 大量依赖 operative 的 Marks of Chaos 关键词 (KHORNE/NURGLE/SLAANESH/TZEENTCH/UNDIVIDED)。需要在 operative 数据中存储此关键词。

4. **Combat Doctrine 子选项**: Combat Doctrine 需要维护当前选中的教条 (Devastator/Tactical/Assault)，且可被 Adjust Doctrine 更改。

5. **条件性免费使用**: 部分 ploy 在特定条件下免费 (0CP):
   - Contagion: Icon Bearer 在敌方领土时
   - Adjust Doctrine: Captain 使用时
   - Wrath of Vengeance: operative 有 Engage order + Chapter Reliquaries 装备
   - Combat Doctrine: Sergeant Doctrine Warfare (once per battle)

6. **CHAPTER TACTIC 系统**: Adaptive Tactics 需要完整的 CHAPTER TACTIC 选择 UI (8 选项)。

### 7.3 优先级建议

| 优先级 | 内容 | 理由 |
|:---:|------|------|
| P0 | 修正所有 6 个虚构 ploy | 当前实现完全不符合官方规则 |
| P0 | 实现 Astartes 双重行动作为被动规则 | 当前错误实现为消耗 CP 的 ploy |
| P1 | 实现所有 Strategy Ploys (12 个) | 核心策略系统 |
| P1 | 实现所有 Firefight Ploys (12 个) | 核心战斗系统 |
| P2 | 实现 Faction Equipment | 增加策略深度 |
| P2 | 实现 CHAPTER TACTIC 系统 | SM 阵营核心机制 |
| P2 | 实现 Marks of Chaos 系统 | Legionary 阵营核心机制 |

---

*本文档基于 Kill Team 2024 (July 2025 Lite Rules) 官方在线规则文档编写，包含截至 2026 年 4 月的所有 Errata 修正。*
