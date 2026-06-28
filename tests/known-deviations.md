# 已知规则分歧登记（Rule Deviations Register）

本文件登记单元测试中发现"代码实现"与"规则文档"（`docs/rules/merged/merged_kt_lite_rules_zh.md`）
不一致之处。**oracle = 规则文档，不是代码。** 每条分歧在测试中以真实 FAIL 暴露（标题标注缺陷号），
修复后转绿、状态置 RESOLVED。

> 约定：发现新分歧时，1) 写一条规则为准的红测（FAIL），2) 在此登记，3) 修代码后置 RESOLVED。

| 缺陷 | 模块/位置 | 规则要求 | 代码原行为 | 状态 |
|------|-----------|----------|------------|------|
| D1 | shootResolver.js:116-122 掩体分支 | 掩体额外赠 1 普通防守，**投骰池不减**（"可不投骰保留一枚普通成功"） | 把 DF 投骰池减 1 再赠 1 → 少掷一颗 | ✅ RESOLVED 2026-06-27 |
| D12 | dice.js evaluateAttackRolls / evaluateDefenseRolls | "每个结果为1的掷骰总是失败"（攻击/防御均适用，含 bs/sv≤1） | bs/sv≤1 时把自然 1 算作普通成功 | ✅ RESOLVED 2026-06-27 |

## 待测/已知但尚未加红测的分歧（来自 test-design 文档，待对应模块可测）

- D2 combat.js Severe 读陈旧 `wizardState.attackCrit`
- D3 combat.js Rending 先减普通后加暴击（顺序相关）
- D4 combat.js Lethal 5+ 暴击阈值对 6 重复计数
- D5 combat.js **近战 Severe 未实现**
- D6 combat.js 瘟疫 DR `hasPloyActive` 硬编码 false（死分支）
- D7 combat.js 毒素在伤害后施加（时序竞态）
- D8 combat.js 次要目标 Severe 未传上下文
- D9 combat.js Brutal 近战上下文未校验
- D10 combat.js Punishing 失败过滤冗余
- D11 combat.js Soul Gorge 治疗/过热自伤 RNG 未测

> D2–D11 在 `src/js/combat.js`（DOM 耦合），需先抽取/导出纯函数或新增 `src/rules/resolveMelee.js`
> 才能加确定性单测。详见 `_bmad-output/test-artifacts/test-design-epic-combat-resolution.md`。
